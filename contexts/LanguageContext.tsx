import React, { createContext, useContext, useCallback, type FC } from 'react';

// Define the shape of the context
interface LanguageContextType {
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const enStrings: { [key: string]: string } = {
  "header_browseTrainers": "Browse Trainers",
  "header_forTrainers": "For Trainers",
  "header_about": "About",
  "header_dashboard": "Dashboard",
  "header_messages": "Messages",
  "header_welcome": "Welcome, ",
  "header_logout": "Logout",
  "header_login": "Log In",
  "header_signup": "Sign Up",

  "discovery_trainersFound_zero": "No Trainers Found",
  "discovery_trainersFound_one": "1 Trainer Found",
  "discovery_trainersFound_other": "{count} Trainers Found",
  "discovery_filters": "Filters",
  "discovery_gridView": "Grid View",
  "discovery_mapView": "Map View",

  "filters_specialty": "Specialty",
  "filters_rating": "Rating",
  "filters_maxHourlyRate": "Max Hourly Rate",
  "filters_location": "Location",
  "filters_locationPlaceholder": "e.g. Tel Aviv",
  "filters_onlineOnly": "Online Only",

  "specialty_Yoga": "Yoga",
  "specialty_Weightlifting": "Weightlifting",
  "specialty_Cardio": "Cardio",
  "specialty_Pilates": "Pilates",
  "specialty_CrossFit": "CrossFit",
  "specialty_Boxing": "Boxing",
  "specialty_Nutrition": "Nutrition",
  "specialty_Running": "Running",

  "trainerCard_perHour": "/ hour",
  "trainerCard_viewProfile": "View Profile",
  "trainerCard_messageTrainer": "Message Trainer",
  "trainerCard_online": "Online",

  "login_welcomeBack": "Welcome Back",
  "login_subtitle": "Log in to continue your fitness journey.",
  "login_emailLabel": "Email Address",
  "login_emailPlaceholder": "you@example.com",
  "login_passwordLabel": "Password",
  "login_passwordPlaceholder": "••••••••",
  "login_rememberMe": "Remember me",
  "login_error": "Invalid email or password. Please try again.",
  "login_button": "Log In",
  "login_noAccount": "Don't have an account?",
  "login_signUpLink": "Sign Up",

  "signup_createAccountTitle": "Create Your Account",
  "signup_step1_subtitle": "Let's start with the basics.",
  "signup_usernameLabel": "Username",
  "signup_usernamePlaceholder": "your_username",
  "signup_passwordHelper": "Password must be at least 6 characters.",
  "signup_continue": "Continue",
  "signup_haveAccount": "Already have an account?",
  "signup_loginLink": "Log In",
  "signup_emailError": "Please enter a valid email address.",
  "signup_passwordError": "Password must be at least 6 characters.",
  "signup_usernameError_length": "Username must be at least 3 characters.",
  "signup_usernameError_format": "Username can only contain letters, numbers, and underscores.",

  "signup_step2_title": "Add a Profile Picture",
  "signup_step2_subtitle": "This helps trainers get to know you.",
  "signup_back": "Back",
  "signup_skipContinue": "Skip & Continue",
  "signup_step3_title": "Tell Us About Yourself",
  "signup_step3_subtitle": "This helps us find the best trainers for you.",
  "signup_fullNameLabel": "Full Name",
  "signup_fullNamePlaceholder": "e.g. Yossi Cohen",
  "signup_ageLabel": "Age",
  "signup_agePlaceholder": "Your age",
  "signup_sexLabel": "Sex",
  "signup_sexSelect": "Select...",
  "signup_sexMale": "Male",
  "signup_sexFemale": "Female",
  "signup_sexOther": "Other",
  "signup_sexPreferNotToSay": "Prefer not to say",
  "signup_goalsLabel": "Fitness Goals",
  "signup_goalsPlaceholder": "e.g., Lose 10kg, build muscle, run a 5k...",
  "signup_cityLabel": "City",
  "signup_citySelect": "Select your city...",
  "signup_locationsLabel": "Preferred Training Locations",
  "signup_locationAtHome": "At Home",
  "signup_locationGym": "Gym",
  "signup_locationPark": "Park",
  "signup_locationOnline": "Online",
  "signup_medicalLabel": "Medical History (Optional)",
  "signup_medicalSublabel": "Please list any conditions or injuries we should be aware of. This information is confidential.",
  "signup_medicalPlaceholder": "e.g., Past knee injury, asthma...",
  "signup_submitButton": "Create Account",
  "signup_progress_step1": "Account",
  "signup_progress_step2": "Picture",
  "signup_progress_step3": "Profile",

  "trainerSignup_title": "Create Your Trainer Account",
  "trainerSignup_subtitle": "Join our platform and connect with clients.",
  "trainerSignup_step2_title": "Add Your Profile Picture",
  "trainerSignup_step2_subtitle": "A professional photo helps you attract clients.",
  "trainerSignup_step3_title": "Build Your Trainer Profile",
  "trainerSignup_step3_subtitle": "Showcase your expertise and skills.",
  "trainerSignup_experienceLabel": "Years of Experience",
  "trainerSignup_experiencePlaceholder": "e.g., 5",
  "trainerSignup_specialtiesLabel": "Specialties (select up to 3)",
  "trainerSignup_locationsLabel": "Where do you train?",
  "trainerSignup_locationClientsHome": "Client's Home",
  "trainerSignup_bioLabel": "Bio",
  "trainerSignup_bioPlaceholder": "Tell clients about your training philosophy, what makes you unique, and what they can expect from your sessions.",
  "trainerSignup_certificationsLabel": "Certifications",
  "trainerSignup_certificationsPlaceholder": "e.g., NASM Certified Personal Trainer, CrossFit Level 2, etc.",
  "trainerSignup_agendaLabel": "Agenda Link (Optional)",
  "trainerSignup_agendaPlaceholder": "https://calendly.com/your-name",
  "trainerSignup_submitButton": "Create Profile",
  "trainerSignup_successTitle": "Welcome, {name}!",
  "trainerSignup_successSubtitle": "Your trainer profile has been created.",
  "trainerSignup_successInfo": "We're excited to have you on the FASTA platform.",
  "trainerSignup_successButton": "Create Another Profile",
  
  "bookingModal_title": "Book a session with",
  "bookingModal_selectDate": "Select a Date",
  "bookingModal_selectTime": "Select a Time",
  "bookingModal_messageLabel": "Message (Optional)",
  "bookingModal_messagePlaceholder": "Any specific requests or goals for this session?",
  "bookingModal_submitButton": "Proceed to Payment for ₪{rate}",
  "day_sun": "Sun", "day_mon": "Mon", "day_tue": "Tue", "day_wed": "Wed", "day_thu": "Thu", "day_fri": "Fri", "day_sat": "Sat",

  "paymentModal_title": "Confirm Payment",
  "paymentModal_subtitle": "for your session with {name}",
  "paymentModal_details_dateTime": "Date & Time:",
  "paymentModal_details_total": "Total:",
  "paymentModal_tab_card": "Credit Card",
  "paymentModal_tab_bit": "Pay with Bit",
  "paymentModal_card_nameLabel": "Cardholder Name",
  "paymentModal_card_namePlaceholder": "Full Name",
  "paymentModal_card_numberLabel": "Card Number",
  "paymentModal_card_numberPlaceholder": "0000 0000 0000 0000",
  "paymentModal_card_expiryLabel": "Expiry Date",
  "paymentModal_card_expiryPlaceholder": "MM / YY",
  "paymentModal_card_cvcLabel": "CVC",
  "paymentModal_card_cvcPlaceholder": "123",
  "paymentModal_card_secure": "Secure payment powered by Stripe",
  "paymentModal_card_error_name": "Name is required",
  "paymentModal_card_error_number": "Invalid card number",
  "paymentModal_card_error_expiry": "Invalid expiry date",
  "paymentModal_card_error_cvc": "Invalid CVC",
  "paymentModal_bit_title": "Scan to pay with Bit",
  "paymentModal_bit_subtitle": "Open your Bit app and scan the QR code to complete the payment.",
  "paymentModal_bit_secure": "Secure and trusted payment",
  "paymentModal_submitButton_processing": "Processing...",
  "paymentModal_submitButton_card": "Pay ₪{rate}",
  "paymentModal_submitButton_bit": "Confirm Payment in Bit",

  "confirmationModal_title": "Booking Successful!",
  "confirmationModal_subtitle": "Your session with {name} is confirmed.",
  "confirmationModal_details_date": "Date",
  "confirmationModal_details_time": "Time",
  "confirmationModal_button_chat": "View Chat",
  "confirmationModal_button_done": "Done",

  "profileModal_about": "About {name}",
  "profileModal_reviews": "Reviews",
  "profileModal_reviewsCount": "({count} reviews)",
  "profileModal_leaveReview": "Leave a review",
  "profileModal_yourRating": "Your Rating:",
  "profileModal_commentPlaceholder": "Share your experience...",
  "profileModal_submitReview": "Submit Review",
  "profileModal_noReviews": "Be the first to leave a review for {name}!",

  "dashboard_welcome": "Welcome, {name}!",
  "dashboard_progressTitle": "Your Progress",
  "dashboard_sessionsCompleted": "Total Sessions Completed",
  "dashboard_medalsTitle": "Your Medals",
  "dashboard_unlockMedal": "Complete {milestone} sessions to unlock.",

  "medalModal_title": "Medal Unlocked!",
  "medalModal_button": "Awesome!",

  "messages_title": "Messages",
  "messages_noMessages": "No messages yet",
  "messages_you": "You: ",
  "messages_bookSession": "Book Session",
  "messages_placeholder": "Type a message...",
  "messages_selectConversation": "Select a conversation to start messaging.",
  "messages_system_bookingConfirmed": "Session confirmed for {date} at {time}.",

  "about_title": "Our Mission at FASTA",
  "about_subtitle": "Connecting you to your fitness potential, unbound by location.",
  "about_mission_title": "Our Mission",
  "about_mission_text": "At FASTA, our core mission is to revolutionize the fitness landscape. We believe that everyone deserves access to a personal trainer who truly understands their unique goals, regardless of geographical barriers. We're here to break down the limitations of 'what's nearby' and connect you with the expertise you need to succeed.",
  "about_clients_title": "For Clients",
  "about_clients_text": "Finding the right trainer is the most crucial step in any fitness journey. FASTA empowers you to discover professionals based on their specialty, coaching style, and your specific objectives—not just their zip code. Whether you want to build muscle, master yoga, or run a marathon, your perfect match is here. Achieve your fitness goals, FASTA.",
  "about_trainers_title": "For Trainers",
  "about_trainers_text": "We're also committed to empowering fitness professionals. FASTA is more than just a discovery platform; it's a comprehensive toolkit for trainers. We help you streamline your business by managing your finances, organizing your schedule, and amplifying your brand through effective advertisement. Focus on what you do best—coaching—and let us handle the rest."
};


// Create the context with a default value
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create a provider component
export const LanguageProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = enStrings[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  }, []);

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a custom hook for easy consumption
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};