import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

/// Loads [url] (defaults to the hosted web-os experience) in a native
/// WebView, with a loading spinner while the page settles and a retry view
/// if the load fails (e.g. no connectivity).
///
/// This is intentionally thin: web-os's actual UI lives entirely in the
/// hosted web app. Native bridging (deep links, push notifications) should
/// hook in here via [WebViewController] callbacks as it's needed, rather
/// than growing the Flutter app itself.
///
/// Two things this widget owns that the hosted app cannot do for itself:
/// keeping top-level navigation inside web-os, and mapping the Android back
/// button onto WebView history. Without both, a single tap on an outbound
/// link inside an embedded app strands the user — this shell has no address
/// bar and no nav chrome to get back with.
class WebOsWebView extends StatefulWidget {
  const WebOsWebView({
    super.key,
    this.url = 'https://web-os.cacherefresh.io',
  });

  final String url;

  @override
  State<WebOsWebView> createState() => _WebOsWebViewState();
}

enum _LoadState { loading, ready, error }

class _WebOsWebViewState extends State<WebOsWebView> {
  late final WebViewController _controller;
  late final String _shellHost;
  _LoadState _loadState = _LoadState.loading;

  @override
  void initState() {
    super.initState();
    _shellHost = Uri.parse(widget.url).host;
    _controller = _buildController();
  }

  WebViewController _buildController() {
    return WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF040611))
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: _onNavigationRequest,
          onPageStarted: (_) => setState(() => _loadState = _LoadState.loading),
          onPageFinished: (_) => setState(() => _loadState = _LoadState.ready),
          onWebResourceError: (_) => setState(() => _loadState = _LoadState.error),
        ),
      )
      ..loadRequest(Uri.parse(widget.url));
  }

  NavigationDecision _onNavigationRequest(NavigationRequest request) {
    // Sub-frame loads are the entire point of web-os: every app preview and
    // the main app frame are iframes pointing at other *.cacherefresh.io
    // hosts. Filtering these on host would blank all of them.
    if (!request.isMainFrame) return NavigationDecision.navigate;

    final target = Uri.tryParse(request.url);
    if (target == null || target.host.isEmpty || target.host == _shellHost) {
      return NavigationDecision.navigate;
    }

    // A top-level navigation off web-os replaces the whole shell with a page
    // that has no way back. Hand it to the system browser instead and leave
    // the WebView where it is.
    unawaited(_openExternally(target));
    return NavigationDecision.prevent;
  }

  Future<void> _openExternally(Uri url) async {
    try {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } on PlatformException {
      // No handler for the scheme. Staying put beats crashing the shell.
    }
  }

  /// Android's back gesture would otherwise close the app outright, even when
  /// the WebView has history to walk back through.
  Future<void> _handlePop(bool didPop, Object? result) async {
    if (didPop) return;
    if (await _controller.canGoBack()) {
      await _controller.goBack();
    } else {
      await SystemNavigator.pop();
    }
  }

  void _retry() {
    setState(() => _loadState = _LoadState.loading);
    _controller.loadRequest(Uri.parse(widget.url));
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: _handlePop,
      child: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_loadState == _LoadState.loading)
            const ColoredBox(
              color: Color(0xFF040611),
              child: Center(
                child: CircularProgressIndicator(color: Color(0xFF9b7bff)),
              ),
            ),
          if (_loadState == _LoadState.error)
            ColoredBox(
              color: const Color(0xFF040611),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      "Couldn't reach web-os",
                      style: TextStyle(color: Colors.white70),
                    ),
                    const SizedBox(height: 12),
                    FilledButton(onPressed: _retry, child: const Text('Retry')),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
