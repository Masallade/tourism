-- Fix about_pages table structure for MySQL
-- Note: MySQL doesn't support DROP COLUMN IF EXISTS, so we need to check manually

-- Add the missing 'values' column (only if it doesn't exist)
-- Run this first:
ALTER TABLE `about_pages` ADD COLUMN `values` JSON NULL AFTER `values_title`;

-- Then drop old columns (run these one by one if you get errors):
-- Drop old value columns
ALTER TABLE `about_pages` DROP COLUMN `value_1_title`;
ALTER TABLE `about_pages` DROP COLUMN `value_1_description`;
ALTER TABLE `about_pages` DROP COLUMN `value_2_title`;
ALTER TABLE `about_pages` DROP COLUMN `value_2_description`;
ALTER TABLE `about_pages` DROP COLUMN `value_3_title`;
ALTER TABLE `about_pages` DROP COLUMN `value_3_description`;

-- Drop old impact stat label columns
ALTER TABLE `about_pages` DROP COLUMN `impact_stat_1_label`;
ALTER TABLE `about_pages` DROP COLUMN `impact_stat_2_label`;
ALTER TABLE `about_pages` DROP COLUMN `impact_stat_3_label`;
ALTER TABLE `about_pages` DROP COLUMN `impact_stat_4_label`;

-- Drop CTA button columns
ALTER TABLE `about_pages` DROP COLUMN `cta_button_1_text`;
ALTER TABLE `about_pages` DROP COLUMN `cta_button_1_link`;
ALTER TABLE `about_pages` DROP COLUMN `cta_button_2_text`;
ALTER TABLE `about_pages` DROP COLUMN `cta_button_2_link`;

