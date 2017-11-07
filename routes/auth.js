const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * OAuth authentication routes. (Sign in)
 */
router.get('/instagram', passport.authenticate('instagram'));
router.get('/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
router.get('/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
router.get('/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
router.get('/foursquare', passport.authorize('foursquare'));
router.get('/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/foursquare');
});
router.get('/tumblr', passport.authorize('tumblr'));
router.get('/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/tumblr');
});
router.get('/steam', passport.authorize('openid', { state: 'SOME STATE' }));
router.get('/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
router.get('/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
router.get('/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/api/pinterest');
});


module.exports = router;

