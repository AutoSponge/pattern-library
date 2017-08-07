'use strict';

const assert = require('chai').assert;
const fire = require('simulant').fire;
const snippet = require('./fixture.html');
const Fixture = require('../../../fixture');
const global = require('../../../../lib/global');
const trapFocus = require('../../../../lib/commons/dialog/trap-focus');

describe('commons/dialog/trap-focus', () => {
  let fixture, element, trigger;

  before(() => {
    fixture = new Fixture();
    global();
  });

  beforeEach(() => {
    fixture.create(snippet);
    const el = fixture.element;
    element = el.querySelector('.dqpl-alert');
    trigger = document.querySelector(`[data-dialog-id="${element.id}"]`);
  });

  afterEach(() => fixture.destroy());
  after(() => fixture.cleanUp());

  describe('on keydown, tab', () => {

    it('should focus the last focusable element', () => {
      fire(trigger, 'click');
      trapFocus('.dqpl-alert');
      const lastFocusable = element.querySelector('.dqpl-buttons .cancel');
      const firstFocusable = element.querySelector('.dqpl-buttons .set');
      fire(firstFocusable, 'keydown', { which: 9, shiftKey: true });
      assert.equal(document.activeElement, lastFocusable);
    });

    it('should focus the first focusable element', () => {
      fire(trigger, 'click');
      trapFocus('.dqpl-alert');
      const lastFocusable = element.querySelector('.dqpl-buttons .cancel');
      const firstFocusable = element.querySelector('.dqpl-buttons .set');
      fire(lastFocusable, 'keydown', { which: 9, shiftKey: false });
      assert.equal(document.activeElement, firstFocusable);
    });
  });
});