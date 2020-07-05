const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Strategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;