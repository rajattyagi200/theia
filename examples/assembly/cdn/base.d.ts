/**********************************************************************
 * Copyright (c) 2018-2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
export interface Extension {
    name: string;
}
export interface CdnArtifact {
    cdn: string | undefined;
}
export interface CdnResource extends CdnArtifact {
    resource: string;
}
export interface CdnChunk extends CdnArtifact {
    chunk: string;
}
export interface CdnExternal extends CdnArtifact {
    external: string;
}
export interface MonacoCdnSupport {
    vsLoader: CdnExternal;
    requirePaths: CdnExternal[];
}
export interface CdnInfo {
    chunks: CdnChunk[];
    resources: CdnResource[];
    monaco: MonacoCdnSupport;
}
export declare class CheCdnSupport {
    private info;
    static readonly className = "CheCdnSupport";
    static instance: CheCdnSupport;
    static register(context: any): void;
    static webpackLoader(source: string): string;
    constructor(info: CdnInfo);
    noCDN: boolean;
    buildScripts(): void;
    buildScriptsWithoutCdn(): void;
    url(withCDN: string | undefined, fallback: string): string;
    resourceUrl(path: string): string;
    vsLoader(context: any): void;
}
//# sourceMappingURL=base.d.ts.map