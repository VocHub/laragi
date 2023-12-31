import React from "react";
import { Button, Grid, Link, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useDispatch, useSelector } from "react-redux";
import { getTagsObjectFromTagsString, isValidUrl } from "../../utils";
import {
  setAllSectionVisibilityFalse,
  updateSearchArchives,
  updateSearchFilter,
  updateSearchPage,
  updateSectionVisibility,
} from "../../app/slice";
import { getArchivesBySearch } from "../../requests/search";
import {
  getSearchCategory,
  getSearchSort,
  getSearchSortDirection,
} from "../../app/selectors";
import { setSearchStats } from "../../storage/search";
import { addSearchToSearchHistory } from "../../storage/history";

export const Tags = ({ archiveTags, onClose }) => {
  const dispatch = useDispatch();
  const tagsAsObject = getTagsObjectFromTagsString(archiveTags);
  const searchCategory = useSelector(getSearchCategory);
  const sort = useSelector(getSearchSort);
  const sortDirection = useSelector(getSearchSortDirection);

  const callNewArchives = async (searchVal) => {
    const arcs = await getArchivesBySearch({
      filter: searchVal,
      sortby: sort,
      order: sortDirection,
      start: -1,
      ...(searchCategory?.id && { category: searchCategory?.id }),
    });
    dispatch(updateSearchArchives(arcs.data));
  };
  const onTagClick = (tagType, tag) => {
    const filter = tagType !== "other" ? `${tagType}:${tag}` : tag;
    callNewArchives(filter);
    dispatch(updateSearchFilter(filter));
    dispatch(updateSearchPage(1));
    dispatch(setAllSectionVisibilityFalse());
    dispatch(updateSectionVisibility({ search: true }));
    onClose();
    const searchStatsObject = {
      filter,
      page: 1,
      sort,
      direction: sortDirection,
      category: searchCategory?.id ?? "",
    };
    setSearchStats(searchStatsObject);
    addSearchToSearchHistory(searchStatsObject);
  };

  return (
    <Grid container spacing={2}>
      {Object.keys(tagsAsObject).map((tagType) => (
        <Grid key={tagType} item xs={12}>
          <Typography>{tagType}:</Typography>
          <Grid container>
            {tagsAsObject[tagType].map((tag) => {
              const validUrl = isValidUrl(tag);
              return (
                <Grid
                  key={`${tagType}:${tag}`}
                  item
                  xs={4}
                  sm={3}
                  sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {!validUrl && (
                    <Button
                      fullWidth
                      variant="text"
                      sx={{ textTransform: "none", padding: 0 }}
                      onClick={() => onTagClick(tagType, tag)}
                    >
                      {tagType === "date_added"
                        ? DateTime.fromSeconds(Number(tag)).toLocaleString()
                        : tag}
                    </Button>
                  )}
                  {validUrl && (
                    <Link
                      target="_blank"
                      rel="noreferrer"
                      href={tag}
                      underline="hover"
                      variant="button"
                      sx={{ textTransform: "none" }}
                    >
                      {tag}
                    </Link>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
