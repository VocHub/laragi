import { Button, Grid } from "@mui/material";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ARCHIVE_STYLES } from "../constants";
import {
  setAllSectionVisibilityFalse,
  updatePages,
  updateSectionVisibility,
  updateCurrentArchiveId,
  updateArchiveOpenedFrom,
} from "../../../app/slice";

const styles = ARCHIVE_STYLES;

export const ArchiveActionButtons = ({
  id,
  currentArchiveId,
  isSearch,
  title,
  onInfoClick,
}) => {
  const dispatch = useDispatch();

  const onPress = useCallback(() => {
    if (currentArchiveId !== id) dispatch(updatePages([]));
    dispatch(setAllSectionVisibilityFalse());
    dispatch(updateSectionVisibility({ images: true }));
    dispatch(updateCurrentArchiveId(id));
    dispatch(updateArchiveOpenedFrom(isSearch ? "search" : "random"));
  }, [id, currentArchiveId, isSearch]);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Button
          aria-label={`Click to read ${title}`}
          variant="contained"
          onClick={onPress}
          fullWidth
          sx={styles.readButton}
        >
          Read
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          aria-label={`Click for info and to modify categories for ${title}`}
          variant="contained"
          onClick={onInfoClick}
          fullWidth
          sx={styles.infoButton}
        >
          Info
        </Button>
      </Grid>
    </Grid>
  );
};
