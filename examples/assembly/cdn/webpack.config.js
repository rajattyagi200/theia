"use strict";
/**********************************************************************
 * Copyright (c) 2018-2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_customizer_1 = require("./webpack-customizer");
// Retrieve the default, generated, Theia Webpack configuration
const baseConfig = require('../webpack.config');
// Export the customized webpack configuration object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = function (env) {
    webpack_customizer_1.customizeWebpackConfig(env.cdn, env.monacopkg, baseConfig);
    return baseConfig;
};
//# sourceMappingURL=webpack.config.js.map