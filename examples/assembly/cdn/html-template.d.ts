/**********************************************************************
 * Copyright (c) 2018-2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
import * as decls from './base';
export declare class CdnHtmlTemplate {
    readonly htmlWebpackPlugin: any;
    readonly compilation: any;
    cdnInfo: decls.CdnInfo;
    nocacheChunks: decls.CdnChunk[];
    constructor(htmlWebpackPlugin: any, compilation: any);
    generateCdnScript(): string;
}
//# sourceMappingURL=html-template.d.ts.map