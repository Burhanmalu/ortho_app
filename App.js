// Polyfill ErrorUtils if not yet available in current runtime
if (typeof global !== 'undefined' && !global.ErrorUtils) {
  let _handler = (e, isFatal) => { if (__DEV__) console.error(e); };
  global.ErrorUtils = {
    setGlobalHandler(fn) { _handler = fn; },
    getGlobalHandler() { return _handler; },
    reportError(e) { _handler && _handler(e, false); },
    reportFatalError(e) { _handler && _handler(e, true); },
    applyWithGuard(fn, ctx, args) { try { return fn.apply(ctx, args); } catch (err) { this.reportError(err); } },
    applyWithGuardIfNeeded(fn, ctx, args) { return fn.apply(ctx, args); },
    inGuard() { return false; },
    guard(fn, name, ctx) { return (...args) => this.applyWithGuard(fn, ctx || this, args); },
  };
}

import React, { useState, useEffect, useRef } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  BackHandler,
  TextInput,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Automatically detect the computer's local IP address from Expo Metro packager
  const getInitialHost = () => {
    try {
      const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoClient?.hostUri;
      if (hostUri) {
        const ip = hostUri.split(':')[0];
        if (ip) return ip;
      }
    } catch (e) {}
    return '192.168.1.2';
  };

  const [hostIp, setHostIp] = useState(getInitialHost());
  const [targetUrl, setTargetUrl] = useState(`http://${getInitialHost()}:5173/`);

  // Handle hardware back button on Android
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [canGoBack]);

  const handleReload = () => {
    setLoading(true);
    setHasError(false);
    const newUrl = `http://${hostIp.trim()}:5173/`;
    setTargetUrl(newUrl);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Main WebView Container */}
      <View style={styles.webContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: targetUrl }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsBackForwardNavigationGestures={true}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          onLoadStart={() => {
            setLoading(true);
            setHasError(false);
          }}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setHasError(true);
          }}
          renderError={() => null}
        />

        {/* Loading Spinner */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0d9488" />
            <Text style={styles.loadingText}>Loading OrthoCare...</Text>
            <Text style={styles.loadingSubText}>{targetUrl}</Text>
          </View>
        )}

        {/* Connection Error Fallback Screen */}
        {hasError && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorIcon}>📡</Text>
            <Text style={styles.errorTitle}>Cannot Connect to Web Server</Text>
            <Text style={styles.errorDesc}>
              Make sure the Vite dev server is running on your computer with:
            </Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>npm run dev</Text>
            </View>
            <Text style={styles.ipLabel}>Computer IP Address:</Text>
            <TextInput
              style={styles.ipInput}
              value={hostIp}
              onChangeText={setHostIp}
              placeholder="e.g. 192.168.1.2"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.retryBtn} onPress={handleReload}>
              <Text style={styles.retryBtnText}>Connect to http://{hostIp.trim()}:5173/</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  loadingSubText: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
  },
  codeBox: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  codeText: {
    color: '#38bdf8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    fontSize: 14,
  },
  ipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    alignSelf: 'flex-start',
    width: '100%',
    maxWidth: 280,
  },
  ipInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
    maxWidth: 280,
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#0d9488',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
