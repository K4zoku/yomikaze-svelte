<script>
  let PrivacyPolicies = [
    {
      id: 1,
      title: 'Information We Collect',
      description: `Registration Information, when you create an account, we collect information such as your name, email address, and password. Payment Information, if you make purchases through the app, we collect payment information such as credit card numbers or other payment details.
Usage Data, we collect information about how you interact with the app, including the pages you visit, the time you spend on pages, and the actions you take.
Device and Connection Data, we collect information about the device you use to access the app, including IP address, device type, operating system, and browser type.`
    },
    {
      id: 2,
      title: 'How We Use Information',
      description: `Personal Information, registration details (name, email, password), payment information (credit card, etc.). With Non-Personal Information: Usage data (page visits, actions), device and connection data (IP address, device type, OS, browser type).`
    },
    {
      id: 3,
      title: 'Sharing Your Information',
      description: `We use the collected information for the following purposes:

Providing Services, to create and manage your account, provide comics, and process transactions.
Improving Services, to analyze app usage and improve features and user experience.
Communicating with You, to send notifications, updates, and information related to your account or services you have requested.
Security, to protect our and users' rights and property from fraud and illegal activities.`
    },
    {
      id: 4,
      title: 'Information Security',
      description:
        'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of data transmission over the Internet or electronic storage is completely secure. Therefore, we cannot guarantee absolute security for your information.'
    },
    {
      id: 5,
      title: 'Your Rights',
      description:
        'You have the right to access, modify, or delete your personal information that we store. You also have the right to opt out of receiving marketing notifications from us. To exercise these rights, please contact us at support@comicapp.com.'
    },
    {
      id: 6,
      title: 'Cookies and Tracking Technologies',
      description: `We use cookies and other tracking technologies to collect information about your activity on the app and improve our services. You can adjust your browser settings to refuse cookies, but this may affect your ability to use the app.`
    },
    {
      id: 7,
      title: 'Changes to the Privacy Policy',
      description:
        'We may update this privacy policy from time to time. Any changes will be notified on the app and/or via email. Your continued use of the app after the changes take effect means you accept the new privacy policy.'
    },
    {
      id: 8,
      title: 'Contact Us',
      description:
        'If you have any questions about this privacy policy, please contact us at support@comicapp.com.'
    }
  ];
</script>

<div class="flex container pt-8">
  <!-- Sidebar for Table of Contents -->
  <div class="w-1/4 h-screen bg-gray-100 p-4">
    <ul class="list-none space-y-2">
      {#each PrivacyPolicies as PrivacyPolicy}
        <li>
          <a href={`#term-${PrivacyPolicy.id}`} class="text-blue-500 font-semibold hover:underline"
            >{PrivacyPolicy.id}. {PrivacyPolicy.title}</a
          >
        </li>
      {/each}
    </ul>
  </div>

  <!-- Main Content Area -->
  <div class="w-3/4 p-4 overflow-y-auto">
    <!-- Welcome Message -->
    <p>
      Welcome to our comic reading app! We are committed to protecting your privacy. This privacy
      policy explains how we collect, use, and protect your personal information when you use the
      app.
    </p>

    <!-- Main Content -->
    <div class="mt-4">
      <ul class="list-none">
        {#each PrivacyPolicies as PrivacyPolicy}
          <li class="font-semibold scroll-target" id={`term-${PrivacyPolicy.id}`}>
            {PrivacyPolicy.id}. {PrivacyPolicy.title}
          </li>
          <li class="mb-4">{PrivacyPolicy.description}</li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style>
  .scroll-target::before {
    @apply block content-[""] h-20 -mt-20;
  }

  html {
    @apply scroll-smooth;
  }
  .container {
    max-width: 1200px;
    margin-top: 2rem;
  }
</style>
