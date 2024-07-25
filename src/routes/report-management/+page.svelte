<script>
  let allData = [
		{
		  imgSrc: "../readingmode/anh1.png",
		  title: "Naruto 1",
		  date: "Jan 05, 2023",
		  author: "FOG.Bomna",
		  description: "Troll entry"
		},
		{
		  imgSrc: "../readingmode/anh2.png",
		  title: "Naruto 2",
		  date: "Jan 06, 2023",
		  author: "FOG.Bomna",
		  description: "Troll entry"
		},
		{
		  imgSrc: "../readingmode/anh3.png",
		  title: "Naruto 3",
		  date: "Jan 07, 2023",
		  author: "FOG.Bomna",
		  description: "Troll entry"
		},
		{
		  imgSrc: "../readingmode/anh4.png",
		  title: "Naruto 4",
		  date: "Jan 08, 2023",
		  author: "FOG.Bomna",
		  description: "Troll entry"
		},
		{
		  imgSrc: "../readingmode/anh1.png",
		  title: "Naruto 5",
		  date: "Jan 09, 2023",
		  author: "FOG.Bomna",
		  description: "Troll entry"
		},
		{
		  imgSrc: "../readingmode/anh2.png",
		  title: "Naruto 6",
		  date: "Jan 10, 2023",
		  author: "FOG.Bomna",
		  description: "Troll entry"
		},
	];
</script>
<div class="container mt-16">
  <div class="flex justify-center mt-10">
    <div role="tablist" class="tabs tabs-bordered">
      <a href="?tab=comics" role="tab" class="tab">Comic</a>
      <a href="?tab=chapters" role="tab" class="tab">Chapter</a>
      <a href="?tab=comments" role="tab" class="tab">Comment</a>
      <a href="?tab=users" role="tab" class="tab">User</a>
    </div>
  </div>

  <div class="mt-10">
    <div class="overflow-x-auto w-auto ">
      <table class="table">
        <thead>
        <tr>
          <th>Details</th>
          <th>Time</th>
          <th>Reporter</th>
          <th>Reason</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        {#each allData as row, index}
          <tr>
          <th class="flex gap-4">
            <img class="w-10 h-14 object-contain" src={row.imgSrc} alt="">
            <p class="self-center">{row.title}</p>
          </th>
          <td>{row.date}</td>
          <td>{row.author}</td>
          <td>{row.description}</td>
          <td>
            <details class="dropdown flex justify-center">
            <summary class="btn m-1">Pending</summary>
            <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-36 p-2 shadow mr-3">
              <li><a>Unban</a></li>
              <li><a >Delete</a></li>
            </ul>
            </details>
          </td>
          </tr>
        {/each}
        </tbody>
      </table>
    </div>
  
  </div>
</div>
