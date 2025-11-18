-- Fix about_pages table structure
-- Add the missing 'values' column
ALTER TABLE `about_pages` ADD COLUMN `values` JSON NULL AFTER `values_title`;

-- Drop old value columns if they exist
ALTER TABLE `about_pages` 
DROP COLUMN IF EXISTS `value_1_title`,
DROP COLUMN IF EXISTS `value_1_description`,
DROP COLUMN IF EXISTS `value_2_title`,
DROP COLUMN IF EXISTS `value_2_description`,
DROP COLUMN IF EXISTS `value_3_title`,
DROP COLUMN IF EXISTS `value_3_description`;

-- Drop old impact stat label columns if they exist
ALTER TABLE `about_pages`
DROP COLUMN IF EXISTS `impact_stat_1_label`,
DROP COLUMN IF EXISTS `impact_stat_2_label`,
DROP COLUMN IF EXISTS `impact_stat_3_label`,
DROP COLUMN IF EXISTS `impact_stat_4_label`;

-- Drop CTA button columns if they exist
ALTER TABLE `about_pages`
DROP COLUMN IF EXISTS `cta_button_1_text`,
DROP COLUMN IF EXISTS `cta_button_1_link`,
DROP COLUMN IF EXISTS `cta_button_2_text`,
DROP COLUMN IF EXISTS `cta_button_2_link`;

