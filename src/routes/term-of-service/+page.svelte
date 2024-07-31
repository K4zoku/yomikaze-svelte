<script>
	import Sublayout from '$components/yomikaze/sublayout.svelte';
  let TermOfSers = [
    {
      id: 1,
      title: 'Accept Terms',
      description:
        'By creating an account or using the application, you agree to comply with these terms of service. If you do not agree with any part of these terms, please do not use the application.'
    },
    {
      id: 2,
      title: 'Our Services',
      description:
        'The app gives you access to diverse comics from various sources. The Services may include features such as online reading, downloading, and other interactive tools.'
    },
    {
      id: 3,
      title: 'User Account',
      description: `Sign up: You may need to create an account to use some app features. You undertake to provide accurate, complete and updated information during the registration process.
Account security: You are responsible for protecting your password and account. We are not responsible for any damages arising from your failure to protect your account information.
Age restriction: You must be at least 13 years old to create an account and use the service.`
    },
    {
      id: 4,
      title: 'Privacy',
      description:
        'Our privacy policy explains how we collect, use and protect your personal information. By using the application, you agree to those policies.'
    },
    {
      id: 5,
      title: 'Content',
      description: `Intellectual property: All content on the application, including but not limited to text, graphics, images, and software, is owned by us or our content providers us and are protected by intellectual property laws.
License to Use: We grant you a personal, non-exclusive, non-transferable, revocable license to access and use the content on the application for your personal and non-commercial purposes.
User Content: By submitting, posting, or displaying any content to the application, you grant us the rights to use, copy, modify, and distribute such content globally.`
    },
    {
      id: 6,
      title: 'Forbidden Acts',
      description: `You agree not to perform the following acts:
Use the service for any illegal purpose.
Violate the copyright or intellectual property rights of a third party.
Upload or distribute any material that contains viruses, malware, or any other harmful code.
Interfere with or disrupt the service or the servers or networks connected to the service.`
    },
    {
      id: 7,
      title: 'Termination of service',
      description:
        'We reserve the right to terminate or suspend your account and access to the service at any time, without prior notice, if you violate these terms or for any other reason.'
    },
    {
      id: 8,
      title: 'Disclaimer of warranties',
      description:
        'The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of availability, accuracy , or fitness for a particular purpose.'
    },
    {
      id: 9,
      title: 'Limitation of liability',
      description:
        'Under no circumstances will we be liable for any damages arising from the use or inability to use our services, including but not limited to direct, indirect damages consequent, incidental, or consequential.'
    },
    {
      id: 10,
      title: 'Change Terms',
      description:
        'We may amend these terms at any time. Changes will be notified on the application and/or via email. Your continued use of the service after the changes take effect constitutes your acceptance of the new terms.'
    },
    {
      id: 11,
      title: 'Contact',
      description:
        'If you have any questions about the terms of service, please contact us via email contact@yomikaze.org'
    }
  ];
</script>
<Sublayout pageName="Terms of Service" >
	<div class="flex">
	  <!-- Sidebar for Table of Contents -->
	  <div class="w-1/4 p-4">
		<ul class="list-none space-y-2">
		  {#each TermOfSers as TermOfSer}
			<li>
			  <a href={`#term-${TermOfSer.id}`} class=" font-semibold hover:underline"
				>{TermOfSer.id}. {TermOfSer.title}</a
			  >
			</li>
		  {/each}
		</ul>
	  </div>
	
	  <!-- Main Content Area -->
	  <div class="w-full p-4 overflow-y-auto">
		<!-- Welcome Message -->
		<p>
		  Welcome to our comic reading app! We are committed to protecting your privacy. This privacy
		  policy explains how we collect, use, and protect your personal information when you use the
		  app.
		</p>
	
		<!-- Main Content -->
		<div class="mt-4">
		  <ul class="list-none">
			{#each TermOfSers as TermOfSer}
			  <li class="font-semibold" id={`term-${TermOfSer.id}`}>
				{TermOfSer.id}. {TermOfSer.title}
			  </li>
			  <li class="mb-4">{TermOfSer.description}</li>
			{/each}
		  </ul>
		</div>
	  </div>

</Sublayout>
