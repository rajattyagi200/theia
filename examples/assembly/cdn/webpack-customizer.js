"use strict";
/**********************************************************************
 * Copyright (c) 2018-2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.customizeWebpackConfig = void 0;
const path = require('path');
const webpack = require("webpack");
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
function customizeWebpackConfig(cdn, monacopkg, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
baseConfig
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
    let theiaCDN = '';
    let monacoCDN = '';
    if (cdn) {
        if (fs.existsSync(cdn)) {
            const cdnJson = JSON.parse(fs.readFileSync(cdn, 'utf8'));
            theiaCDN = cdnJson.theia;
            monacoCDN = cdnJson.monaco;
        }
    }
    if (monacoCDN && !monacopkg) {
        throw new Error("Please check that you specified the parameter '--env monacopkg' for 'theia build' command.");
    }
    if (theiaCDN || monacoCDN) {
        const assemblyRoot = path.resolve(__dirname, '..');
        const theiaRoot = path.resolve(assemblyRoot, '..', '..');
        const frontendIndex = path.resolve(assemblyRoot, 'src-gen', 'frontend', 'index.js');
        const cheExtensions = path.resolve(theiaRoot, 'che') + '/';
        // Add the cdn-support.js file at the beginning of the entries.
        // It contains the logic to load various types of files from the configured CDN
        // if available, or fallback to the local file
        const originalEntry = baseConfig.entry;
        baseConfig.entry = {
            'cdn-support': path.resolve(__dirname, 'bootstrap.js'),
            theia: originalEntry,
        };
        // Include the content hash to enable long-term caching
        baseConfig.output.filename = '[name].[chunkhash].js';
        // Separate the webpack runtime module, theia modules, external vendor modules
        // in 3 distinct chunks to optimize caching management
        baseConfig.optimization = {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    che: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        test(module, chunks) {
                            const req = module.userRequest;
                            const takeit = req && (req.endsWith(frontendIndex) || req.includes(cheExtensions));
                            if (takeit) {
                                console.info('Added in Che chunk: ', module.userRequest);
                            }
                            return takeit;
                        },
                        name: 'che',
                        chunks: 'all',
                        enforce: true,
                        priority: 1,
                    },
                    defaultVendors: {
                        test: /[\/]node_modules[\/](?!@theia[\/])/,
                        name: 'vendors',
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        };
        // fix "process is not defined" error
        baseConfig.plugins.push(new webpack.ProvidePlugin({
            process: 'process/browser',
        }));
        // Use our own HTML template to trigger the CDN-supporting
        // logic, with the CDN prefixes passed as env parameters
        baseConfig.plugins.push(new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'cdn/custom-html.html',
            inject: false,
            customparams: {
                cdnPrefix: theiaCDN,
                monacoCdnPrefix: monacoCDN,
                cachedChunkRegexp: '^(theia|che|vendors).[^.]+.js$',
                cachedResourceRegexp: '^.*.(wasm|woff2|gif)$',
                monacoEditorCorePackage: monacopkg,
            },
        }));
        // Insert a custom loader to override file and url loaders,
        // in order to insert CDN-related logic
        baseConfig.module.rules
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((rule) => rule.loader && rule.loader.match(/(file-loader|url-loader)/))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .forEach((rule) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const originalLoader = {
                loader: rule.loader,
            };
            if (rule.options) {
                originalLoader.options = rule.options;
            }
            delete rule.options;
            delete rule.loader;
            rule.use = [
                {
                    loader: path.resolve('cdn/webpack-loader.js'),
                },
                originalLoader,
            ];
        });
    }
}
exports.customizeWebpackConfig = customizeWebpackConfig;
//# sourceMappingURL=webpack-customizer.js.map