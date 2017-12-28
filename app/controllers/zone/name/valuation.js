'use strict';

const commons = require('../../../commons');
const ss = require('simple-statistics');
const { get } = commons.repository('properties');

const masterLogger = commons.logger.child({ controller: 'valuation' });

/**
 * Get statistical information about a zone. Returns:
 *  - An object that contains key value pairs with operation as key and
 *    a nested object of property type and min, max, mean and std deviation.
 *
 * Example (not actual data):
 *
 *  /api/v1/zone/flores/valuation
 *     {
 *        "2": {
 *          "7": {
 *            "min": 78000,
 *            "max": 190000,
 *            "mean": 134000,
 *            "stddev": 5400
 *          },
 *          "2": {
 *            "min": 78000,
 *            "max": 190000,
 *            "mean": 134000,
 *            "stddev": 5400
 *          },
 *          ...
 *        },
 *        "1": { ... }
 *     }
 *
 * @param {Request} req
 * @param {Response} res
 */
module.exports = function zoneNameValuationController(req, res) {
  const logger = masterLogger.child({ fn: 'zoneNameValuationController' });
  const datasource = get();

  const body = {};
  const name = req.params.name.toLowerCase();

  const onError = (err) => { logger.error(err); res.status(500).send('oopsie') };
  const onFinished = () => {
      for (var operation in body){
          for (var type in body[operation]){
              var values = body[operation][type];
              var statistics = {
                  min: ss.min(values),
                  max: ss.max(values),
                  mean: ss.mean(values),
                  stddev: ss.standardDeviation(values),
                  extra:{
                      nProperties: values.length
                  }
              }
              body[operation][type] = statistics;
          }
      }
      res.json(body);
  };

  const filter = datasource.filter( property => {
      return property.county.toLowerCase() == name || property.area.toLowerCase() == name || property.province.toLowerCase() == name;
  });

  filter.subscribe((property) => {
      var operation = body[property.operation];
      if (operation == undefined){
          operation = {}
      }
      var type = operation[property.bldgType];
      if (type == undefined){
          type = []
      }
      type.push(parseInt(property.valuation));
      operation[property.bldgType] = type;
      body[property.operation] = operation;
  }, onError, onFinished);
};
