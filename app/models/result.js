/*
 *  Copyright 2016, Yahoo Inc.
 *  Licensed under the terms of the Apache License, Version 2.0.
 *  See the LICENSE file associated with the project for terms.
 */
import { equal, or, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import DS from 'ember-data';
import { AGGREGATIONS } from 'bullet-ui/models/aggregation';

export default DS.Model.extend({
  created: DS.attr('date', {
    defaultValue() {
      return new Date(Date.now());
    }
  }),
  query: DS.belongsTo('query', { autoSave: true }),
  // TODO: change it to async: true when metadata and records computed properties are removed.
  segments: DS.hasMany('segment', { dependent: 'destroy' }),
  pivotOptions: DS.attr('string'),
  querySnapshot: DS.attr(),

  // TODO: Remove them after result page has been changed.
  metadata: alias('segments.lastObject.metadata'),
  records: alias('segments.lastObject.records'),

  isRaw: equal('querySnapshot.type', AGGREGATIONS.get('RAW')),
  isCountDistinct: equal('querySnapshot.type', AGGREGATIONS.get('COUNT_DISTINCT')),
  isGroup: equal('querySnapshot.type', AGGREGATIONS.get('GROUP')),
  isDistribution: equal('querySnapshot.type', AGGREGATIONS.get('DISTRIBUTION')),
  isTopK: equal('querySnapshot.type', AGGREGATIONS.get('TOP_K')),

  isReallyRaw: computed('isRaw', 'querySnapshot.projectionsSize', function() {
    return this.get('isRaw') && this.get('querySnapshot.projectionsSize') === 0;
  }),

  isGroupAll: computed('isGroup', 'querySnapshot.groupsSize', function() {
    return this.get('isGroup') && this.get('querySnapshot.groupsSize') === 0;
  }),

  isGroupBy: computed('isGroup', 'querySnapshot.{metricsSize,groupsSize}', function() {
    return this.get('isGroup') && this.get('querySnapshot.metricsSize') >= 1 && this.get('querySnapshot.groupsSize') >= 1;
  }),

  isSingleRow: or('isCountDistinct', 'isGroupAll')
});
