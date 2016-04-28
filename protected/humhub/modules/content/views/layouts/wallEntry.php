<?php
/**
 * WallEntry used in a stream and the activity stream.
 *
 * @property Mixed $object a content object like Post
 * @property WallEntry $entry the wall entry to display
 * @property String $content the output of the content object (wallOut)
 *
 * @package humhub.modules_core.wall
 * @since 0.5
 */
?>
<?php 
$cssClass = ($entry->sticked) ? 'wall-entry sticked-entry' : 'wall-entry';

if ($mode != "activity") : ?>
    <div class="<?php echo $cssClass ?>" data-content-base="humhub.modules.stream.StreamEntry" 
            data-content-pk="<?php echo $entry->id; ?>" data-stream-sticked="<?= $entry->sticked ?>">
<?php endif; ?>

<?php echo $content; ?>

<?php if ($mode != "activity") : ?>
    </div>
<?php endif; ?>

