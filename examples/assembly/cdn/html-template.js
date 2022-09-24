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
exports.CdnHtmlTemplate = void 0;
const decls = require("./base");
const fs = require('fs-extra');
class CdnHtmlTemplate {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(htmlWebpackPlugin, compilation) {
        this.htmlWebpackPlugin = htmlWebpackPlugin;
        this.compilation = compilation;
        this.nocacheChunks = [];
        const cachedChunks = [];
        const cachedChunkRegexp = new RegExp(htmlWebpackPlugin.options.customparams.cachedChunkRegexp);
        const cachedResourceRegexp = new RegExp(htmlWebpackPlugin.options.customparams.cachedResourceRegexp);
        const cdnPrefix = htmlWebpackPlugin.options.customparams.cdnPrefix
            ? htmlWebpackPlugin.options.customparams.cdnPrefix
            : '';
        const monacoCdnPrefix = htmlWebpackPlugin.options.customparams.monacoCdnPrefix
            ? htmlWebpackPlugin.options.customparams.monacoCdnPrefix
            : '';
        const monacoEditorCorePackage = htmlWebpackPlugin.options.customparams.monacoEditorCorePackage
            ? htmlWebpackPlugin.options.customparams.monacoEditorCorePackage
            : '';
        // eslint-disable-next-line guard-for-in
        for (const index in htmlWebpackPlugin.files.js) {
            const url = htmlWebpackPlugin.files.js[index];
            const chunk = {
                chunk: url,
                cdn: undefined,
            };
            if (cdnPrefix && url.match(cachedChunkRegexp)) {
                chunk.cdn = cdnPrefix + url;
                cachedChunks.push(chunk);
            }
            else {
                this.nocacheChunks.push(chunk);
            }
        }
        const cachedResourceFiles = [];
        if (cdnPrefix) {
            let asset;
            for (asset in compilation.assets) {
                if (asset.match(cachedResourceRegexp)) {
                    cachedResourceFiles.push({
                        resource: asset,
                        cdn: cdnPrefix + asset,
                    });
                }
            }
        }
        const vsLoader = {
            external: './vs/original-loader.js',
            cdn: undefined,
        };
        const monacoEditorCorePath = {
            external: 'vs/editor/editor.main',
            cdn: undefined,
        };
        if (monacoCdnPrefix) {
            vsLoader.cdn = monacoCdnPrefix + monacoEditorCorePackage + '/min/vs/loader.js';
            monacoEditorCorePath.cdn =
                monacoCdnPrefix + monacoEditorCorePackage + '/min/' + monacoEditorCorePath.external;
        }
        const monacoRequirePaths = [monacoEditorCorePath];
        if (cdnPrefix || monacoCdnPrefix) {
            const monacoFiles = monacoRequirePaths
                .map(elem => ['.js', '.css', '.nls.js']
                .map(extension => ({
                external: elem.external + extension,
                cdn: elem.cdn + extension,
            }))
                .filter(elemt => compilation.assets[elemt.external]))
                .reduce((acc, val) => acc.concat(val), []);
            monacoFiles.push(vsLoader);
            fs.ensureDirSync('lib');
            fs.writeFileSync('lib/cdn.json', JSON.stringify(cachedChunks
                .concat(monacoFiles)
                .concat(cachedResourceFiles), undefined, 2));
        }
        this.cdnInfo = {
            chunks: cachedChunks,
            resources: cachedResourceFiles,
            monaco: {
                vsLoader: vsLoader,
                requirePaths: monacoRequirePaths,
            },
        };
    }
    generateCdnScript() {
        return `new ${decls.CheCdnSupport.className}(${JSON.stringify(this.cdnInfo)}).buildScripts();`;
    }
}
exports.CdnHtmlTemplate = CdnHtmlTemplate;
//# sourceMappingURL=html-template.js.map