package com.notifiqueipro.app

import android.content.Context
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

object ScheduleManager {

    fun scheduleNotification(context: Context, title: String, message: String, delayInMinutes: Long) {
        val inputData = Data.Builder()
            .putString("TITLE", title)
            .putString("MESSAGE", message)
            .build()

        val workRequest = OneTimeWorkRequestBuilder<NotificationWorker>()
            .setInitialDelay(delayInMinutes, TimeUnit.MINUTES)
            .setInputData(inputData)
            .build()

        WorkManager.getInstance(context).enqueue(workRequest)
    }
}
