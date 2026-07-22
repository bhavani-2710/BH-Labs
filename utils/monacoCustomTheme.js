export default function defineThemes(monaco) {
  monaco.editor.defineTheme("bh-light", {
    base: "vs",
    inherit: true,

    rules: [],

    colors: {
      "editor.background": "#fefefe",
      "editorGutter.background": "#fefefe",

      "editor.lineHighlightBackground": "#f2f2f2",

      "editor.selectionBackground": "#5521FF20",
      "editor.inactiveSelectionBackground": "#5521FF12",

      "editorWidget.background": "#FFFFFF",
      "editorWidget.border": "#E4E4E7",

      "editorHoverWidget.background": "#FFFFFF",
      "editorHoverWidget.border": "#E4E4E7",

      "editorSuggestWidget.background": "#FFFFFF",
      "editorSuggestWidget.selectedBackground": "#F3F0FF",

      "editorOverviewRuler.border": "#00000000",

      "scrollbarSlider.background": "#D4D4D866",
      "scrollbarSlider.hoverBackground": "#5521FF55",
      "scrollbarSlider.activeBackground": "#5521FF88",
    },
  });
  monaco.editor.defineTheme("bh-dark", {
    base: "vs-dark",
    inherit: true,

    rules: [],

    colors: {
      "editor.background": "#18181B",
      "editorGutter.background": "#18181B",

      "editor.lineHighlightBackground": "#24242A",

      "editor.selectionBackground": "#5521FF55",
      "editor.inactiveSelectionBackground": "#5521FF25",

      "editorWidget.background": "#232326",
      "editorWidget.border": "#3F3F46",

      "editorHoverWidget.background": "#232326",
      "editorHoverWidget.border": "#3F3F46",

      "editorSuggestWidget.background": "#232326",
      "editorSuggestWidget.selectedBackground": "#312460",

      "editorOverviewRuler.border": "#00000000",

      "scrollbarSlider.background": "#52525B66",
      "scrollbarSlider.hoverBackground": "#5521FF66",
      "scrollbarSlider.activeBackground": "#5521FF99",
    },
  });
}
