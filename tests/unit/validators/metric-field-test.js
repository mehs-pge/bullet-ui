/*
 *  Copyright 2016, Yahoo Inc.
 *  Licensed under the terms of the Apache License, Version 2.0.
 *  See the LICENSE file associated with the project for terms.
 */
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { METRICS } from 'bullet-ui/models/metric';

module('Unit | Validator | metric-field', function(hooks) {
  setupTest(hooks);

  test('it checks to see if all metrics besides count have a field', function(assert) {
    var validator = this.owner.lookup('validator:metric-field');
    let mockModel = EmberObject.create({
      type: METRICS.get('SUM')
    });
    let expected = `All metrics but ${METRICS.get('COUNT')} require a field`;
    assert.equal(validator.validate(null, null, mockModel), expected);

    mockModel.set('type', METRICS.get('MIN'));
    assert.equal(validator.validate(null, null, mockModel), expected);

    mockModel.set('type', METRICS.get('AVG'));
    assert.equal(validator.validate(null, null, mockModel), expected);

    mockModel.set('type', METRICS.get('MAX'));
    assert.equal(validator.validate(null, null, mockModel), expected);

    mockModel.set('type', METRICS.get('COUNT'));
    assert.ok(validator.validate(null, null, mockModel));
  });
});
