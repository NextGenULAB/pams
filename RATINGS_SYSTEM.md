# Ratings System Implementation

## Overview
The ratings system allows patients to rate and review doctors after completing appointments. This system provides transparency and helps other patients make informed decisions when choosing healthcare providers.

## Features

### For Patients
- Rate doctors from 1-5 stars after completing appointments
- Add optional comments/reviews
- View ratings and reviews for any doctor
- Cannot rate the same appointment multiple times

### For Doctors
- Display average rating and total number of ratings
- Show rating distribution (how many 1-star, 2-star, etc.)
- Display recent reviews with patient names and comments
- Ratings are publicly visible on their profile

### For Admins
- View all ratings in the system
- Filter ratings by star rating, search by name/specialty
- Sort ratings by date, rating value, etc.
- Monitor rating quality and patient feedback

## Database Schema

### Rating Model
```prisma
model Rating {
  id            String   @id @default(uuid())
  patientId     String
  patient       User     @relation("PatientRatings", fields: [patientId], references: [id], onDelete: Cascade)
  doctorId      String
  doctor        User     @relation("DoctorRatings", fields: [doctorId], references: [id], onDelete: Cascade)
  appointmentId String   @unique // One rating per appointment
  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  rating        Int      // 1-5 stars
  comment       String?  @db.Text
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([doctorId, rating])
  @@index([patientId])
}
```

### Updated User Model
- Added `ratings` relation for patient ratings
- Added `doctorRatings` relation for doctor ratings

### Updated Appointment Model
- Added `rating` relation (optional, one-to-one)

## API Actions

### `submitRating(formData)`
- Allows patients to submit ratings for completed appointments
- Validates appointment ownership and completion status
- Prevents duplicate ratings for the same appointment

### `getDoctorRatings(doctorId)`
- Fetches all ratings for a specific doctor
- Includes patient names and appointment dates
- Ordered by creation date (newest first)

### `getDoctorRatingStats(doctorId)`
- Calculates average rating and total count
- Provides rating distribution (count of each star level)
- Returns structured statistics for display

### `checkExistingRating(appointmentId)`
- Checks if a patient has already rated a specific appointment
- Used to show/hide rating buttons

### `getAllRatings()`
- Admin-only function to view all ratings
- Includes patient and doctor details
- Used for ratings management dashboard

## Components

### RatingDisplay
- Shows comprehensive rating information on doctor profiles
- Displays average rating, total count, and distribution
- Lists recent reviews with patient names and comments

### RatingForm
- Interactive form for patients to submit ratings
- Star rating selection with hover effects
- Optional comment field
- Form validation and submission handling

### RatingSummary
- Compact rating display for doctor cards and listings
- Shows stars and rating count
- Configurable size (sm, md, lg)

### RatingsManagement (Admin)
- Comprehensive admin interface for managing ratings
- Search, filter, and sort functionality
- Detailed view of all rating data

## UI Integration

### Doctor Profile Page
- Ratings section below doctor information
- Rating summary in sidebar
- Recent reviews display

### Doctor Listing Pages
- Rating summary on each doctor card
- Quick visual indicator of doctor quality

### Appointment Cards
- Rating button for completed appointments
- "Already Rated" badge for rated appointments
- Rating form modal for submission

### Admin Dashboard
- New "Ratings" tab in admin interface
- Complete ratings management system

## Rating Logic

### Rating Calculation
- Average rating: Sum of all ratings divided by total count
- Rounded to 1 decimal place for display
- Star display: Full stars for integer ratings, half-star for decimals

### Validation Rules
- Only patients can rate doctors
- Only completed appointments can be rated
- One rating per appointment maximum
- Rating must be 1-5 stars
- Comments are optional

### Display Rules
- Ratings are publicly visible
- Patient names are shown (unless anonymous)
- Comments are displayed in full
- Rating dates are shown

## Security Considerations

- Authentication required for rating submission
- Patients can only rate their own appointments
- Admin access required for ratings management
- Input validation on rating values and comments

## Future Enhancements

- Rating moderation system
- Response system for doctors to reply to reviews
- Rating analytics and trends
- Rating verification (appointment completion confirmation)
- Rating helpfulness voting
- Rating categories (bedside manner, expertise, etc.)

## Usage Examples

### Submitting a Rating
```javascript
const formData = new FormData();
formData.append("appointmentId", "appointment-123");
formData.append("rating", "5");
formData.append("comment", "Excellent consultation, very helpful!");

const result = await submitRating(formData);
```

### Displaying Doctor Ratings
```javascript
const { ratings } = await getDoctorRatings(doctorId);
const { averageRating, totalRatings, ratingDistribution } = await getDoctorRatingStats(doctorId);

// Use in RatingDisplay component
<RatingDisplay ratingStats={{ averageRating, totalRatings, ratingDistribution }} ratings={ratings} />
```

### Quick Rating Summary
```javascript
// Use in doctor cards or listings
<RatingSummary averageRating={4.5} totalRatings={12} size="sm" />
```

