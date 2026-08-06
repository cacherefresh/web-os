import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

/// Loads [url] (defaults to the hosted web-os experience) in a native
/// WebView, with a loading spinner while the page settles and a retry view
/// if the load fails (e.g. no connectivity).
///
/// This is intentionally thin: web-os's actual UI lives entirely in the
/// hosted web app. Native bridging (deep links, push notifications) should
/// hook in here via [WebViewController] callbacks as it's needed, rather
/// than growing the Flutter app itself.
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
  _LoadState _loadState = _LoadState.loading;

  @override
  void initState() {
    super.initState();
    _controller = _buildController();
  }

  WebViewController _buildController() {
    return WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF040611))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) => setState(() => _loadState = _LoadState.loading),
          onPageFinished: (_) => setState(() => _loadState = _LoadState.ready),
          onWebResourceError: (_) => setState(() => _loadState = _LoadState.error),
        ),
      )
      ..loadRequest(Uri.parse(widget.url));
  }

  void _retry() {
    setState(() => _loadState = _LoadState.loading);
    _controller.loadRequest(Uri.parse(widget.url));
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
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
    );
  }
}
