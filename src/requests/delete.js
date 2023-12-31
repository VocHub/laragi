import axios from "axios";
import { DELETE_ARCHIVE_URL } from "./constants";
import { getApiKey, getBaseUrl } from "../storage/requests";

const config = {
  method: "delete",
};

export const deleteArchiveById = async (archiveId) =>
  axios({
    ...config,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
    url: `http://${getBaseUrl()}${DELETE_ARCHIVE_URL.replace(
      ":id",
      archiveId
    )}`,
  })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
      return { error: "Sorry, something went wrong" };
    });
