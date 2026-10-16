const path = require('node:path');

const { readJsonArray } = require('../../../utils/jsonStore');

const TASKS_FILE_PATH = path.join(process.cwd(), 'data', 'tasks.json');
const ACTIVITY_FILE_PATH = path.join(process.cwd(), 'data', 'activity.json');
const RECENT_ACTIVITY_WINDOW_MS = 24 * 60 * 60 * 1000;

function isRecentActivity(entry, nowMs) {
  const whenMs = Date.parse(entry.when);
  if (Number.isNaN(whenMs)) {
    return false;
  }

  return nowMs - whenMs <= RECENT_ACTIVITY_WINDOW_MS && whenMs <= nowMs;
}

async function getTasksSummary() {
  const [tasks, activities] = await Promise.all([
    readJsonArray(TASKS_FILE_PATH),
    readJsonArray(ACTIVITY_FILE_PATH),
  ]);

  const nowMs = Date.now();
  let todo = 0;
  let done = 0;

  for (const task of tasks) {
    if (task.completed === true) {
      done += 1;
    } else {
      todo += 1;
    }
  }

  return {
    total: tasks.length,
    byStatus: {
      todo,
      'in-progress': 0,
      done,
    },
    recentActivityCount: activities.filter((entry) => isRecentActivity(entry, nowMs)).length,
  };
}

module.exports = {
  getTasksSummary,
};