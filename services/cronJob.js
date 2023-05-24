import cron from 'node-cron';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import Check from '../models/checkModel.js';
import Report from '../models/reportModel.js';

class CronJob {
  constructor() {
    this.taskMap = {};
  }

  async checkAvailabilityCallback(check) {
    const {
      url,
      protocol,
      path,
      port,
      timeout,
      threshold,
      authentication,
      httpHeaders,
      assert,
    } = check;

    const client = axios.create({
      baseURL: `${protocol}://${url}:${port}`,
      timeout: timeout * 1000,
      auth: authentication,
      headers: httpHeaders,
    });

    axiosRetry(client, { retries: threshold });

    const startTime = Date.now();

    try {
      const res = await client.get(path);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const report = await Report.findOne({ checkId: check._id });

      report.averageResponseTime =
        (report.averageResponseTime + responseTime) / 2;

      if (assert && assert.statusCode && res.status !== assert.statusCode) {
        await this.handleFailure(
          'status code does not match',
          startTime,
          report,
        );
      } else {
        await this.handleSuccess(report, startTime);
      }

      await report.save();
    } catch (error) {
      await this.handleFailure(error, startTime);
    }
  }

  async handleSuccess(report, startTime) {
    report.uptime = (report.uptime + (Date.now() - startTime)) / 1000;
    report.status = 'up';
    report.history.push({
      timestamp: new Date().toISOString(),
      status: report.status,
    });
  }

  async handleFailure(error, startTime, report) {
    report.downtime = (report.downtime + (Date.now() - startTime)) / 1000;
    report.status = 'down';
    report.outages++;
    report.history.push({
      timestamp: new Date().toISOString(),
      status: report.status,
    });
  }

  async start() {
    const checks = await Check.find();

    checks.forEach((check) => {
      this.addTask(check);
    });
  }

  addTask(check) {
    const task = cron.schedule(`*/${check.interval} * * * *`, () => {
      this.checkAvailabilityCallback(check);
    });
    this.taskMap[check._id] = task;
  }

  removeTask(checkId) {
    const task = this.taskMap[checkId];
    if (task) {
      task.stop();
      delete this.taskMap[checkId];
    }
  }
}

export const cronJob = new CronJob();
