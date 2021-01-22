
<?php
$menu_items = wp_get_nav_menu_items('main-nav');
if( $menu_items ) {
foreach ($menu_items as $menu_item ) {
$args = array('p' => $menu_item->object_id,'post_type' => 'any');
 
global $wp_query;
$wp_query = new WP_Query($args);
?>
 
<section <?php post_class('sep'); ?> id="<?php echo sanitize_title($menu_item->title); ?> ">
<?php 
if ( have_posts() ){
   include(locate_template('home-page.php'));
} ?>
</section>