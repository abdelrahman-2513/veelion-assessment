const path = require('node:path');

const { createId } = require('../../../utils/id');
const { readJsonArray, writeJsonArray } = require('../../../utils/jsonStore');

const ACTIVITY_FILE_PATH = path.join(process.cwd(), 'data', 'activity.json');

async function getAllActivity() {
  return readJsonArray(ACTIVITY_FILE_PATH);
}

async function createActivity(payload) {
  const activities = await readJsonArray(ACTIVITY_FILE_PATH);
  const activity = {
    id: createId(),
    when: new Date().toISOString(),
  };

  if (payload.action !== undefined) {
    activity.action = payload.action;
  }

  if (payload.info !== undefined) {
    activity.info = payload.info;
  }

  activities.push(activity);
  await writeJsonArray(ACTIVITY_FILE_PATH, activities);

  return activity;
}

module.exports = {
  getAllActivity,
  createActivity,
};