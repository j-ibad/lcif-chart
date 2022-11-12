export function redirectHTTPS(req, res, next) {
  return (req.socket.encrypted) 
    ? next()
    : res.redirect('https://' + req.headers.host + req.url);
}