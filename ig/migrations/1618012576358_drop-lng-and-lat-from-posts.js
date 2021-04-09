/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        ALTER TABLE posts
        DROP COLUMN lat, 
        DROP COlUMn lng;
    `);
};

exports.down = pgm => {
    pgm.sql(`
        ALTER TABLE posts
        ADD COLUMN lat numeric,
        ADD COlUMn lng numeric;
    `);
};
