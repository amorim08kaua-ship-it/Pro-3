package com.notifiqueipro.app

import android.content.Context
import androidx.work.Worker
import androidx.work.WorkerParameters

class NotificationWorker(
    context: Context,
    workerParams: WorkerParameters
) : Worker(context, workerParams) {

    override fun doWork(): Result {
        val title = inputData.getString("TITLE") ?: "Lembrete"
        val message = inputData.getString("MESSAGE") ?: "Você tem uma nova notificação."

        val helper = NotificationHelper(applicationContext)
        helper.showNotification(title, message)

        return Result.success()
    }
}
