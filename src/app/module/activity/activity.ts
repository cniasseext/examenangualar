import { isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Activity, ActivityType } from '../../model/activity.model';
@Component({
  selector: 'app-activity',
  imports: [FormsModule],
  templateUrl: './activity.html',
  styleUrl: './activity.css',
})
export class ActivityComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  activityName = signal('');
  activityType = signal<ActivityType>('SPORT');
  activityValue = signal<number>(0);

  activities = signal<Activity[]>(this.loadActivities());

  totalCalories = computed(() =>
    this.activities()
      .filter((activity) => activity.type === 'SPORT')
      .reduce((total, activity) => total + activity.value, 0)
  );

  totalWater = computed(() =>
    this.activities()
      .filter((activity) => activity.type === 'HYDRATATION')
      .reduce((total, activity) => total + activity.value, 0)
  );

  remainingCalories = computed(() => 2000 - this.totalCalories());

  healthGoalReached = computed(() =>
    this.totalWater() >= 1500 && this.totalCalories() > 500
  );

  dehydrationWarning = computed(() => this.totalWater() < 1500);

  constructor() {
    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem('fit-track-activities', JSON.stringify(this.activities()));
      }
    });
  }

  addActivity() {
    if (!this.activityName().trim() || this.activityValue() <= 0) {
      return;
    }

    const newActivity: Activity = {
      id: Date.now(),
      name: this.activityName(),
      type: this.activityType(),
      value: this.activityValue(),
      createdAt: new Date().toLocaleTimeString(),
    };

    this.activities.update((current) => [newActivity, ...current]);

    this.activityName.set('');
    this.activityType.set('SPORT');
    this.activityValue.set(0);
  }

  private loadActivities(): Activity[] {
    if (!this.isBrowser) {
      return [];
    }

    const data = localStorage.getItem('fit-track-activities');
    return data ? JSON.parse(data) : [];
  }


}
