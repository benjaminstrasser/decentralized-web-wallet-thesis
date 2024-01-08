<script lang="ts">
	import { greeter } from "../libs/blockchain";
    let greeting: Promise<string>;
    updateGreeting();


    let newGreeting = "";

    async function setGreeting(){
        const resposne = await greeter.setGreeting(newGreeting);
        updateGreeting();
    }

    function updateGreeting() {
        greeting = greeter.greet()
    }
</script>

<div>
    {#await greeting then value}
        Curretn greeting: {value} 
    {/await}
</div>


<input type="text" bind:value={newGreeting}>
<input type="button" value="New Greeting" on:click={() => setGreeting()} />