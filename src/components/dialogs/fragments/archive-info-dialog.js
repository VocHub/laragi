import React, { useCallback, useEffect, useState } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Delete } from "@mui/icons-material";
import { BaseDialog } from "../base-dialog";
import getArchiveMetaData from "../../../requests/metadata";
import { Categories } from "../../categories/categories";
import { Tags } from "../../tags/tags";
import { updateCategories } from "../../../app/slice";
import { getCategories as getStateCategories } from "../../../app/selectors";
import getCategories, {
  getArchiveCategories,
} from "../../../requests/categories";
import { DeleteArchive } from "../../delete-archive/delete-archive";

export const ArchiveInfoDialog = ({ onClose: onCloseProp, arcId, open }) => {
  const dispatch = useDispatch();
  const categories = useSelector(getStateCategories);
  const [archiveData, setArchiveData] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const updateShowDelete = useCallback(
    (show) => setShowDelete(show),
    [showDelete]
  );
  const onClose = useCallback(() => {
    onCloseProp();
    updateShowDelete(false);
  }, [onCloseProp, updateShowDelete]);
  const onDeleteIconClick = useCallback(() => {
    updateShowDelete(true);
  }, []);

  useEffect(() => {
    const getArchiveData = async () => {
      const metaData = await getArchiveMetaData(arcId);
      const categoriesData = await getArchiveCategories(arcId);
      setArchiveData({
        ...metaData,
        categories: categoriesData?.categories ?? [],
      });
    };

    if (arcId) getArchiveData();
  }, [arcId, setArchiveData]);

  useEffect(() => {
    const getCats = async () => {
      dispatch(updateCategories(await getCategories()));
    };
    if (!categories.length) getCats();
  }, [categories]);

  const archiveTitle = archiveData?.title ?? "";
  const dialogTitle = (
    <Grid container justifyContent="space-between">
      <Typography sx={{ alignSelf: "center", ml: "1rem" }} variant="h6">
        Archive Info
      </Typography>
      <IconButton
        aria-label="Open Delete Archive Section"
        onClick={onDeleteIconClick}
      >
        <Delete />
      </IconButton>
    </Grid>
  );

  return (
    <BaseDialog
      title={!showDelete ? dialogTitle : "Delete Archive?"}
      onClose={onClose}
      open={open}
    >
      {!showDelete ? (
        <>
          <Grid container spacing={4} sx={{ padding: "2rem 0 1rem 0" }}>
            <Grid item xs={12} sm={6}>
              <Grid
                alignContent="center"
                justifyContent="center"
                container
                sx={{ height: "100%" }}
              >
                <Typography textAlign="center">{archiveTitle}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Categories arcId={arcId} categories={categories} />
            </Grid>
          </Grid>
          <Typography>
            Categories:{" "}
            {archiveData?.categories?.map((cat) => cat?.name ?? "").join(", ")}
          </Typography>
          <Typography sx={{ padding: "1rem 0" }}>
            Pages: {archiveData?.pagecount ?? 0}
          </Typography>
          <Tags onClose={onClose} archiveTags={archiveData?.tags ?? ""} />
        </>
      ) : (
        <DeleteArchive
          arcId={arcId}
          title={archiveTitle}
          onBack={updateShowDelete}
          onClose={onClose}
        />
      )}
    </BaseDialog>
  );
};
