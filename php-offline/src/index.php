<!doctype html>
<html class="no-js" lang="">

<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" href="/css/style.css">
</head>

<body>
    <?php
echo '<p>Hello world! This is HTML5 Boilerplate. From PHP. With ServiceWorker.</p>';
echo '<a href="/offline.html">Navigate</a>';
?>
  <script src="/js/test.js"></script>
  <script>
  // Check that service workers are registered
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
      //navigator.serviceWorker.register('/js/sw.js', {scope: '/'});
    });
  }
  </script>
</body>
</html>
