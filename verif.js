/* eslint-disable @typescript-eslint/no-var-requires */
const omit = require('omit');
const {log} = require('@core_chlbri/core/dist/functions/log');

const before = {a: 1, b: 2, c: 3};
const after = omit('a')(before);

log('before', before);
log('after', after);
