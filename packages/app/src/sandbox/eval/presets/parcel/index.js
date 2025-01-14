import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import tsTranspiler from '../../transpilers/typescript';
import vueTranspiler from '../../transpilers/vue';
import vueTemplateTranspiler from '../../transpilers/vue/template-compiler';
import vueStyleTranspiler from '../../transpilers/vue/style-compiler';
import vueSelector from '../../transpilers/vue/selector';
import vueStyleLoader from '../../transpilers/vue/style-loader';
import cssLoader from '../../transpilers/vue/css-loader';
import htmlTranspiler from './transpilers/html-transpiler';
import pugTranspiler from '../../transpilers/pug';
import coffeeTranspiler from '../../transpilers/coffee';
import noopTranspiler from '../../transpilers/noop';

import Preset from '..';

export default function initialize() {
  const parcelPreset = new Preset(
    'parcel',
    [
      'js',
      'jsx',
      'ts',
      'tsx',
      'json',
      'less',
      'scss',
      'sass',
      'styl',
      'css',
      'vue',
    ],
    {},
    {
      htmlDisabled: true,
      setup: manager => {
        const packageJSON = manager.configurations.package;

        if (packageJSON && packageJSON.parsed && packageJSON.parsed.alias) {
          manager.preset.setAdditionalAliases(packageJSON.parsed.alias);
        }
      },
    }
  );

  parcelPreset.registerTranspiler(module => /\.coffee$/.test(module.path), [
    { transpiler: coffeeTranspiler },
    { transpiler: babelTranspiler },
  ]);

  parcelPreset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
    {
      transpiler: babelTranspiler,
      options: {
        dynamicCSSModules: true,
      },
    },
  ]);

  parcelPreset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: tsTranspiler },
  ]);

  parcelPreset.registerTranspiler(module => /\.pug$/.test(module.path), [
    { transpiler: pugTranspiler },
    { transpiler: htmlTranspiler },
  ]);

  parcelPreset.registerTranspiler(module => /\.html$/.test(module.path), [
    { transpiler: htmlTranspiler },
  ]);

  parcelPreset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
  ]);

  parcelPreset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  // VUE START
  parcelPreset.registerTranspiler(module => /\.vue$/.test(module.path), [
    { transpiler: vueTranspiler },
  ]);
  parcelPreset.registerTranspiler(() => false, [
    { transpiler: vueTemplateTranspiler },
  ]);
  parcelPreset.registerTranspiler(() => false, [
    { transpiler: vueStyleTranspiler },
  ]);
  parcelPreset.registerTranspiler(() => false, [{ transpiler: vueSelector }]);
  parcelPreset.registerTranspiler(() => false, [
    { transpiler: vueStyleLoader },
  ]);
  parcelPreset.registerTranspiler(() => false, [{ transpiler: cssLoader }]);
  // VUE END

  const sassWithConfig = {
    transpiler: sassTranspiler,
    options: {},
  };

  const lessWithConfig = {
    transpiler: lessTranspiler,
    options: {},
  };

  const stylusWithConfig = {
    transpiler: stylusTranspiler,
    options: {},
  };
  const styles = {
    css: [],
    scss: [sassWithConfig],
    sass: [sassWithConfig],
    less: [lessWithConfig],
    styl: [stylusWithConfig],
  };

  /**
   * Registers transpilers for all different combinations
   *
   * @returns
   */
  function registerStyleTranspilers() {
    return Object.keys(styles).forEach(type => {
      parcelPreset.registerTranspiler(
        module => new RegExp(`\\.${type}`).test(module.path),
        [...styles[type], { transpiler: stylesTranspiler }]
      );
    });
  }

  registerStyleTranspilers();

  parcelPreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  parcelPreset.registerTranspiler(() => false, [
    { transpiler: noopTranspiler },
  ]);

  return parcelPreset;
}
