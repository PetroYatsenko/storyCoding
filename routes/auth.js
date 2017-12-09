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
router.get('/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */

module.exports = router;

