const rootStylesThumb = window.getComputedStyle(document.documentElement)

if (rootStylesThumb.getPropertyValue('--listing-thumb-width') != null && rootStylesThumb.getPropertyValue('--listing-thumb-width') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
  const thumbWidth = parseFloat(rootStylesThumb.getPropertyValue('--listing-thumb-width'))
  const thumbAspectRatio = parseFloat(rootStylesThumb.getPropertyValue('--listing-thumb-aspect-ratio'))
  const thumbHeight = thumbWidth / thumbAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / thumbAspectRatio,
    imageResizeTargetWidth: thumbWidth,
    imageResizeTargetHeight: thumbHeight
  })
  
  FilePond.parse(document.body)
}