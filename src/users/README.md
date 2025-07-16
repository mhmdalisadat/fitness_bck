# Users API Documentation

## Overview
این ماژول مدیریت کاربران را فراهم می‌کند که شامل ایجاد، ویرایش، حذف و جستجوی کاربران است.

## Endpoints

### 1. ایجاد کاربر جدید
**POST** `/users`

**Request Body:**
```json
{
  "phoneNumber": "09123456789",
  "name": "علی احمدی",
  "age": 25,
  "height": 175,
  "weight": 70,
  "trainingExperience": "beginner",
  "trainingGoals": ["weight_loss", "muscle_gain"],
  "medicalConditions": ["none"],
  "injuries": ["none"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت ایجاد شد",
  "data": {
    "user": {
      "id": 1,
      "phoneNumber": "09123456789",
      "name": "علی احمدی",
      "age": 25,
      "height": 175,
      "weight": 70,
      "trainingExperience": "beginner",
      "trainingGoals": ["weight_loss", "muscle_gain"],
      "medicalConditions": ["none"],
      "injuries": ["none"],
      "bmi": "22.9",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 2. دریافت اطلاعات کاربر با شماره تماس
**GET** `/users/:phoneNumber`

**Response:**
```json
{
  "success": true,
  "message": "اطلاعات کاربر با موفقیت دریافت شد",
  "data": {
    "user": {
      "id": 1,
      "phoneNumber": "09123456789",
      "name": "علی احمدی",
      "age": 25,
      "height": 175,
      "weight": 70,
      "trainingExperience": "beginner",
      "trainingGoals": ["weight_loss", "muscle_gain"],
      "medicalConditions": ["none"],
      "injuries": ["none"],
      "bmi": "22.9",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "workouts": []
  }
}
```

### 3. دریافت لیست کاربران با فیلتر و صفحه‌بندی
**GET** `/users?page=1&limit=10&isActive=true&search=علی`

**Query Parameters:**
- `page`: شماره صفحه (پیش‌فرض: 1)
- `limit`: تعداد آیتم در هر صفحه (پیش‌فرض: 10)
- `isActive`: فیلتر بر اساس وضعیت فعال بودن
- `trainingExperience`: فیلتر بر اساس سطح تجربه
- `ageMin`: حداقل سن
- `ageMax`: حداکثر سن
- `search`: جستجو در نام کاربر

**Response:**
```json
{
  "success": true,
  "message": "لیست کاربران با موفقیت دریافت شد",
  "data": {
    "users": [
      {
        "id": 1,
        "phoneNumber": "09123456789",
        "name": "علی احمدی",
        "age": 25,
        "height": 175,
        "weight": 70,
        "trainingExperience": "beginner",
        "trainingGoals": ["weight_loss", "muscle_gain"],
        "medicalConditions": ["none"],
        "injuries": ["none"],
        "bmi": "22.9",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### 4. دریافت اطلاعات کاربر با ID
**GET** `/users/id/:id`

**Response:**
```json
{
  "success": true,
  "message": "اطلاعات کاربر با موفقیت دریافت شد",
  "data": {
    "user": {
      "id": 1,
      "phoneNumber": "09123456789",
      "name": "علی احمدی",
      "age": 25,
      "height": 175,
      "weight": 70,
      "trainingExperience": "beginner",
      "trainingGoals": ["weight_loss", "muscle_gain"],
      "medicalConditions": ["none"],
      "injuries": ["none"],
      "bmi": "22.9",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 5. بروزرسانی کاربر
**PUT** `/users/:id`

**Request Body:**
```json
{
  "name": "علی احمدی جدید",
  "age": 26,
  "weight": 72,
  "trainingGoals": ["strength", "muscle_gain"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت بروزرسانی شد",
  "data": {
    "user": {
      "id": 1,
      "phoneNumber": "09123456789",
      "name": "علی احمدی جدید",
      "age": 26,
      "height": 175,
      "weight": 72,
      "trainingExperience": "beginner",
      "trainingGoals": ["strength", "muscle_gain"],
      "medicalConditions": ["none"],
      "injuries": ["none"],
      "bmi": "23.5",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### 6. حذف نرم کاربر (Soft Delete)
**DELETE** `/users/:id`

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت حذف شد",
  "data": {
    "user": {
      "id": 1,
      "phoneNumber": "09123456789",
      "name": "علی احمدی",
      "isActive": false,
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### 7. حذف سخت کاربر (Hard Delete)
**DELETE** `/users/hard/:id`

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت حذف شد",
  "data": {
    "user": {
      "id": 1,
      "phoneNumber": "09123456789",
      "name": "علی احمدی"
    }
  }
}
```

### 8. بازگردانی کاربر حذف شده
**POST** `/users/restore/:id`

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت بازگردانی شد",
  "data": {
    "user": {
      "id": 1,
      "phoneNumber": "09123456789",
      "name": "علی احمدی",
      "isActive": true,
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### 9. دریافت آمار کاربران
**GET** `/users/stats/overview`

**Response:**
```json
{
  "success": true,
  "message": "آمار کاربران با موفقیت دریافت شد",
  "data": {
    "stats": {
      "totalUsers": 100,
      "activeUsers": 85,
      "inactiveUsers": 15,
      "averageAge": 28,
      "averageHeight": 172,
      "averageWeight": 70,
      "experienceDistribution": {
        "beginner": 40,
        "intermediate": 35,
        "advanced": 25
      }
    }
  }
}
```

## Validation Rules

### فیلدهای اجباری:
- `phoneNumber`: شماره تماس (منحصر به فرد)
- `name`: نام کاربر
- `age`: سن (12-100)
- `height`: قد (100-250 سانتی‌متر)
- `weight`: وزن (30-300 کیلوگرم)
- `trainingExperience`: سطح تجربه تمرین

### فیلدهای اختیاری:
- `trainingGoals`: اهداف تمرین
- `medicalConditions`: شرایط پزشکی
- `injuries`: آسیب‌ها
- `isActive`: وضعیت فعال بودن

## Error Responses

### خطای اعتبارسنجی:
```json
{
  "success": false,
  "message": "فیلدهای اجباری خالی هستند",
  "errors": ["شماره تماس الزامی است"],
  "required_fields": ["phoneNumber", "name", "age", "height", "weight", "trainingExperience"]
}
```

### خطای تکراری بودن شماره تماس:
```json
{
  "success": false,
  "message": "کاربر با این شماره تماس قبلاً ثبت شده است"
}
```

### خطای عدم یافتن کاربر:
```json
{
  "success": false,
  "message": "کاربر مورد نظر یافت نشد"
}
```

## Enums

### TRAINING_EXPERIENCE_LEVELS:
- `beginner`: مبتدی
- `intermediate`: متوسط
- `advanced`: پیشرفته

### TRAINING_GOALS:
- `weight_loss`: کاهش وزن
- `muscle_gain`: افزایش عضله
- `strength`: قدرت
- `endurance`: استقامت
- `flexibility`: انعطاف‌پذیری
- `general_fitness`: تناسب اندام عمومی

### MEDICAL_CONDITIONS:
- `heart_disease`: بیماری قلبی
- `diabetes`: دیابت
- `hypertension`: فشار خون بالا
- `asthma`: آسم
- `arthritis`: آرتریت
- `none`: هیچ کدام

### INJURIES:
- `knee`: زانو
- `shoulder`: شانه
- `back`: کمر
- `wrist`: مچ دست
- `ankle`: مچ پا
- `none`: هیچ کدام 