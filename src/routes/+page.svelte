<script lang="ts">
  import Carousel from 'svelte-carousel';
  import { browser } from '$app/environment';
</script>

{#if browser}
  <Carousel autoplay autoplayDuration={2000}>
    <div class="background-primary">Primary</div>
    <div class="background-secondary">Secondary</div>
  </Carousel>
{/if}

{#each Array(20) as item}
  <p class="text-justify">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pretium elit ac convallis
    imperdiet. Suspendisse venenatis dignissim tellus, a tempor tellus tristique at. Etiam vitae
    blandit tellus, eu luctus est. In elit ligula, sodales at convallis non, ultrices vitae nunc.
    Nullam laoreet pulvinar commodo. Duis ultricies consequat orci, nec aliquam metus iaculis at.
    Donec auctor iaculis nisi a imperdiet. Duis eu malesuada tortor. Ut dolor neque, fermentum sed
    ligula non, mattis volutpat lorem. Aenean euismod eu orci ac varius. In facilisis tellus tellus,
    vitae pellentesque massa sagittis vitae. Integer vestibulum sodales mi, in varius quam convallis
    nec. Nunc in ligula turpis. Mauris ut massa id augue condimentum venenatis. Donec arcu nisi,
    ornare in lectus nec, ornare efficitur ante. Aliquam egestas elit nec mi venenatis eleifend.
    Fusce quis aliquet enim. Suspendisse mattis ligula urna, et porttitor lorem mollis at. Duis erat
    augue, sagittis ut neque non, egestas vulputate felis. Pellentesque condimentum ligula et
    ultrices tempus. Etiam sem dui, malesuada vel nunc vel, egestas gravida dolor. Fusce tincidunt
    nec tellus sit amet venenatis. Sed dictum ante ex, vel vestibulum urna vehicula sit amet. Ut ac
    vehicula leo, eu placerat metus. Morbi condimentum tincidunt feugiat. Suspendisse in mollis
    enim, malesuada cursus massa. Integer congue ut mi in vestibulum. Suspendisse augue augue,
    vestibulum a gravida et, dignissim quis elit. Donec eu mi semper, scelerisque dui condimentum,
    elementum ex. Nulla mollis semper ornare. Quisque non odio tincidunt, lobortis sapien volutpat,
    cursus nisi. Suspendisse ultrices libero id lectus malesuada feugiat. Proin mattis fringilla
    ante in commodo. Duis sagittis at lectus non efficitur. Integer nisi sem, faucibus egestas
    mauris a, finibus dignissim leo. Mauris sit amet mauris sit amet leo pharetra sodales. Quisque
    luctus urna at arcu dignissim, quis vehicula libero cursus. Sed convallis gravida nulla, sed
    iaculis turpis venenatis ac. Maecenas luctus, leo eu consectetur mattis, sapien mauris viverra
    lacus, sit amet vestibulum ante magna vitae sem. Nam hendrerit gravida volutpat. Ut ut lobortis
    orci. Fusce est nulla, scelerisque quis quam sit amet, auctor eleifend odio. Nulla facilisi.
    Aenean tincidunt fringilla molestie. Nunc non ultrices leo, bibendum mollis nibh. Orci varius
    natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer eu tempus
    massa, blandit bibendum purus. Donec mollis tempus arcu vel viverra. Pellentesque habitant morbi
    tristique senectus et netus et malesuada fames ac turpis egestas.
  </p>
{/each}
