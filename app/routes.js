'use strict';

/* WARNING: this file is @generated by Express-Micro.
 * Do NOT remove any comments or change the project layout
 * unless you really know what you're doing. Otherwise the
 * generator won't know where to insert new route definitions.
 */

const commons = require('./commons');
const express = require('express');

const controller = commons.controller;
const router = new express.Router({ caseSensitive: false });

// generator - insert routes here
router.get('/zone/:name/valuation', controller('zone/name/valuation'));
router.get('/properties', controller('properties'));
commons.logger.debug('router initialized');

module.exports = router;
