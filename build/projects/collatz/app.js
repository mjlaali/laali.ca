formula = document.querySelector("#formula");
sequence = document.querySelector("#sequence").childNodes[0];

coeff = document.querySelector("#coeff");
bias = document.querySelector("#bias");
mod = document.querySelector("#mod");
start = document.querySelector("#start");

repeated_seq = document.querySelector("#repeated-seq");
no_repeated_seq = document.querySelector("#no-repeated-seq")


formula.addEventListener("submit", analyze);

function collatz(a, b, c, n){
    const seen = new Set();
    const seq = [];
    let added = true;

    for (let i = 0; i < 1000 && (!added || !seen.has(n)); i++) {
        if (added){
            seq.push(n);
            seen.add(n);
        }
        added = false;
        
        if (i % 2 === 0){
            n = a * n + b;
            added = true;
        } else {
            while (n % c === 0){
                if (added){
                    seq.push(n);
                }

                n = n / c;
                added = true;
            }
        }
    }

    let repeat;
    if (seen.has(n)){
        repeat = true;
        seq.push(n);
    } else
        repeat = false;

    return [seq, repeat];
}


function analyze(e) {
    e.preventDefault();
    const n = parseInt(start.value);
    const a = parseInt(coeff.value);
    const b = parseInt(bias.value);
    const c = parseInt(mod.value)

    let [seq, repeated] = collatz(a, b, c, n);
    
    if (seq.length > 20){
        let seq_start = JSON.stringify(seq.slice(0, 10)).replaceAll(",", ", ").slice(0, -1);
        let seq_end = JSON.stringify(seq.slice(-10)).replaceAll(",", ", ").slice(1);
        sequence.nodeValue = `${seq_start} ... ${seq_end}`;
    } else {
        sequence.nodeValue = JSON.stringify(seq).replaceAll(",", ", ");
    }
    if (repeated){
        repeated_seq.classList.remove("hide");
        if (!no_repeated_seq.classList.contains("hide"))
            no_repeated_seq.classList.add("hide");
    } else {
        if (!repeated_seq.classList.contains("hide"))
            repeated_seq.classList.add("hide");
        no_repeated_seq.classList.remove("hide");
    }

}


interval = document.querySelector("#interval");

interval.addEventListener("submit", compute_interval);

function compute_interval(e){
    e.preventDefault();

    const a = parseInt(coeff.value);
    const b = parseInt(bias.value);
    const c = parseInt(mod.value)

    const start = parseInt(document.querySelector("#start-interval").value);
    const end = parseInt(document.querySelector("#end-interval").value);

    let result_html = [];

    for(let i = start; i < end; i++){
        let [seq, repeated] = collatz(a, b, c, i);
        let flag, color;
        if (repeated){
            flag = "&#10003;";
            color = "green";
        } else {
            flag = "&#x274C;";
            color = "red";
        }

        result_html.push(`
        <tr class="${color}">
            <td>${i}</td>
            <td>${flag}</td>
            <td>${Math.max( ...seq)}</td>
        </tr>`);
    }

    periodic_numbers = document.querySelector("#periodic-numbers");
    periodic_numbers.innerHTML = result_html.join(" ");
}