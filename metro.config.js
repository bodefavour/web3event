const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('readable-stream'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    vm: require.resolve('vm-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url'),
    assert: require.resolve('assert'),
    util: require.resolve('util'),
    events: require.resolve('events'),
    path: require.resolve('path-browserify'),
    fs: false,
    net: false,
    tls: false,
    child_process: false,
    dns: false,
    dgram: false,
};

// Exclude problematic server-side modules from being bundled
config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Exclude ws (WebSocket) server implementation
    if (moduleName === 'ws' || moduleName.includes('websocket-server')) {
        return {
            type: 'empty',
        };
    }
    
    // Use default resolution for everything else
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
