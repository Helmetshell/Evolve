import { global } from './vars.js';
import { vBind, popover, tagEvent, clearElement } from './functions.js';
import { races } from './races.js';
import { actions, checkCityRequirements } from './actions.js'
import { loc } from './locale.js';

const gmen = {
    soldier: {
        name: loc('governor_soldier'),
        desc: loc('governor_soldier_desc'),
        title: [loc('governor_soldier_t1'),loc('governor_soldier_t2'),loc('governor_soldier_t3')],
        traits: {
            tactician: 1,
            militant: 1
        }
    },
    criminal: {
        name: loc('governor_criminal'),
        desc: loc('governor_criminal_desc'),
        title: [loc('governor_criminal_t1'),loc('governor_criminal_t2'),{ m: loc('governor_criminal_t3m'), f: loc('governor_criminal_t3f') }],
        traits: {
            noquestions: 1,
            racketeer: 1
        }
    },
    entrepreneur: {
        name: loc('governor_entrepreneur'),
        desc: loc('governor_entrepreneur_desc'),
        title: [loc('governor_entrepreneur_t1'),loc('governor_entrepreneur_t2'),{ m: loc('governor_entrepreneur_t3m'), f: loc('governor_entrepreneur_t3f') }],
        traits: {
            dealmaker: 1,
            risktaker: 1
        }
    },
    educator: {
        name: loc('governor_educator'),
        desc: loc('governor_educator_desc'),
        title: [loc('governor_educator_t1'),loc('governor_educator_t2'),loc('governor_educator_t3')],
        traits: {
            teacher: 1,
            theorist: 1
        }
    },
    spiritual: {
        name: loc('governor_spiritual'),
        desc: loc('governor_spiritual_desc'),
        title: [loc('governor_spiritual_t1'),loc('governor_spiritual_t2'),loc('governor_spiritual_t3')],
        traits: {
            
        }
    },
    bluecollar: {
        name: loc('governor_bluecollar'),
        desc: loc('governor_bluecollar_desc'),
        title: [{ m: loc('governor_bluecollar_t1m'), f: loc('governor_bluecollar_t1f') },loc('governor_bluecollar_t2'),{ m: loc('governor_bluecollar_t3m'), f: loc('governor_bluecollar_t3f') }],
        traits: {
            pragmatist: 1
        }
    },
    noble: {
        name: loc('governor_noble'),
        desc: loc('governor_noble_desc'),
        title: [{ m: loc('governor_noble_t1m'), f: loc('governor_noble_t1f') },{ m: loc('governor_noble_t2m'), f: loc('governor_noble_t2f') },{ m: loc('governor_noble_t3m'), f: loc('governor_noble_t3f') },{ m: loc('governor_noble_t4m'), f: loc('governor_noble_t4f') }],
        traits: {
            extravagant: 1,
            respected: 1
        }
    },
    media: {
        name: loc('governor_media'),
        desc: loc('governor_media_desc'),
        title: [loc('governor_media_t1'),{ m: loc('governor_media_t2m'), f: loc('governor_media_t2f') },loc('governor_media_t3')],
        traits: {
            gaslighter: 1,
            renowned: 1
        }
    },
    sports: {
        name: loc('governor_sports'),
        desc: loc('governor_sports_desc'),
        title: [loc('governor_sports_t1'),loc('governor_sports_t2'),loc('governor_sports_t3')],
        traits: {
            
        }
    },
    bureaucrat: {
        name: loc('governor_bureaucrat'),
        desc: loc('governor_bureaucrat_desc'),
        title: [loc('governor_bureaucrat_t1'),{ m: loc('governor_bureaucrat_t2m'), f: loc('governor_bureaucrat_t2f') },loc('governor_bureaucrat_t3')],
        traits: {
            organizer: 1
        }
    }
};

const gov_traits = {
    tactician: {
        name: loc(`gov_trait_tactician`),
        effect(){ return loc(`gov_trait_tactician_effect`,[$(this)[0].vars[0]]); },
        vars: [5]
    },
    militant: {
        name: loc(`gov_trait_militant`),
        effect(){ return loc(`gov_trait_militant_effect`,[$(this)[0].vars[0],$(this)[0].vars[1]]); },
        vars: [25,10]
    },
    noquestions: {
        name: loc(`gov_trait_noquestions`),
        effect(){ return loc(`gov_trait_noquestions_effect`,[$(this)[0].vars[0]]); },
        vars: [0.0075]
    },
    racketeer: {
        name: loc(`gov_trait_racketeer`),
        effect(){ return loc(`gov_trait_racketeer_effect`,[$(this)[0].vars[0],$(this)[0].vars[1]]); },
        vars: [20,35]
    },
    dealmaker: {
        name: loc(`gov_trait_dealmaker`),
        effect(){ return loc(`gov_trait_dealmaker_effect`,[$(this)[0].vars[0]]); },
        vars: [40]
    },
    risktaker: {
        name: loc(`gov_trait_risktaker`),
        effect(){ return loc(`gov_trait_risktaker_effect`,[$(this)[0].vars[0]]); },
        vars: [10]
    },
    teacher: {
        name: loc(`gov_trait_teacher`)
    },
    theorist: {
        name: loc(`gov_trait_theorist`)
    },
    pragmatist: {
        name: loc(`gov_trait_extravagant`)
    },
    extravagant: {
        name: loc(`gov_trait_extravagant`)
    },
    respected: {
        name: loc(`gov_trait_respected`)
    },
    gaslighter: {
        name: loc(`gov_trait_gaslighter`)
    },
    renowned: {
        name: loc(`gov_trait_renowned`)
    },
    organizer: {
        name: loc(`gov_trait_organizer`),
        effect(){ return loc(`gov_trait_organizer_effect`,[$(this)[0].vars[0]]); },
        vars: [1]
    }
};

const names = {
    humanoid: ['Sanders','Smith','Geddon','Burgundy','Cristo','Crunch','Berg','Morros','Bower','Maximus'],
    carnivore: ['Instinct','Prowl','Paws','Fluffy','Snarl','Claws','Fang','Stalker','Pounce','Sniff'],
    herbivore: ['Sense','Grazer','Paws','Fluffy','Fern','Claws','Fang','Grass','Stampy','Sniff'],
    omnivore: ['Pelt','Munchy','Paws','Fluffy','Snarl','Claws','Fang','Skavers','Pounce','Sniff'],
    small: ['Bahgins','Banks','Shorty','Parte','Underfoot','Shrimp','Finkle','Littlefoot','Cub','Runt'],
    giant: ['Slender','Titan','Colossus','Bean','Tower','Cloud','Bigfoot','Mountain','Crusher','Megaton'],
    reptilian: ['Scale','Chimera','Ecto','Bask','Forks','Croc','Slither','Sunny','Coldfoot','Webtoe'],
    avian: ['Sparrow','Soar','Shiney','Raven','Squaks','Eddy','Breeze','Flap','Kettle','Flock'],
    insectoid: ['Compound','Centi','Hiver','Buzz','Carpace','Swarm','Devour','Carpi','Chitter','Burrow'],
    plant: ['Grover','Blossom','Leaf','Sapper','Stem','Seed','Sprout','Greensly','Root','Fruit'],
    fungi: ['Detritus','Psychedelic','Cap','Rotface','Patch','Spore','Infecto','Filament','Symbiote','Shade'],
    aquatic: ['Seawolf','Finsley','Inko','Sucker','McBoatFace','Wave','Riptide','Shell','Coral','Pearl'],
    fey: ['Whisper','Prank','Mischief','Flutter','Nature','Dirt','Story','Booker','Tales','Spirit'],
    heat: ['Ash','Magnus','Pumice','Vulcano','Sweat','Flame','Lava','Ember','Smoke','Tinder','Spark'],
    polar: ['Frosty','Snowball','Flake','Chiller','Frost','Cooler','Icecube','Arctic','Tundra','Avalanche'],
    sand: ['Dune','Oasis','Sarlac','Spice','Quick','Grain','Spike','Storm','Glass','Castle'],
    demonic: ['Yekun','Kesabel','Gadreel','Penemue','Abaddon','Azazyel','Leviathan','Samyaza','Kasyade','Typhon'],
    angelic: ['Lightbringer','Illuminous','Sparks','Chrub','Halo','Star','Pompous','Radiant','Fluffy','Fabio']
};

function genGovernor(setSize){
    let governors = [];
    let genus = races[global.race.species].type;
    let backgrounds = Object.keys(gmen);
    let nameList = JSON.parse(JSON.stringify(names[genus]));

    setSize = setSize || backgrounds.length;
    for (let i=0; i<setSize; i++){
        if (nameList.length === 0){
            nameList = JSON.parse(JSON.stringify(names[genus]));
        }
        if (backgrounds.length === 0){
            backgrounds = Object.keys(gmen);
        }

        let bgIdx = Math.floor(Math.seededRandom(0,backgrounds.length));
        let nameIdx = Math.floor(Math.seededRandom(0,nameList.length));

        let bg = backgrounds.splice(bgIdx,1)[0];
        let name = nameList.splice(nameIdx,1)[0];

        let title = gmen[bg].title[Math.floor(Math.seededRandom(0,gmen[bg].title.length))];
        if (typeof title === 'object'){
            title = Math.floor(Math.seededRandom(0,2)) === 0 ? title.m : title.f;
        }
        governors.push({ bg: bg, t: title, n: name });
    }
    
    return governors;
}

export function govern(){
    if (global.genes['governor'] && global.tech['governor'] && global.race['governor'] && global.race.governor['g'] && global.race.governor['tasks']){
        global.race.governor.tasks.forEach(function(task){
            if (gov_tasks[task].req()){
                gov_tasks[task].task()
            }
        });
    }
}

export function defineGovernor(){
    if (global.genes['governor'] && global.tech['governor']){
        clearElement($('#r_govern1'));
        if (global.race.hasOwnProperty('governor') && !global.race.governor.hasOwnProperty('candidates')){
            drawnGovernOffice();
        }
        else {
            appointGovernor();
        }
    }
}

function drawnGovernOffice(){
    let govern = $(`<div id="govOffice"><div class="has-text-caution">${loc(`governor_office`,[global.race.governor.g.n])}</div></div>`);
    $('#r_govern1').append(govern);

    govern.append($(`<div><span class="has-text-warning">${loc(`governor_background`)}:</span> <span class="bg">${gmen[global.race.governor.g.bg].name}</span><div>`));

    popover(`govOffice`, function(){
        let desc = '';
        Object.keys(gmen[global.race.governor.g.bg].traits).forEach(function (t){
            desc += (gov_traits[t].hasOwnProperty('effect') ? gov_traits[t].effect() : '') + ' ';
        });
        return desc;
    },
    {
        elm: `#govOffice .bg`,
    });
}

function appointGovernor(){
    let govern = $(`<div id="candidates" class="governor candidates"></div>`);
    $('#r_govern1').append(govern);

    if (!global.race.hasOwnProperty('governor') || !global.race.governor.hasOwnProperty('candidates')){
        global.race['governor'] = {
            candidates: genGovernor(10)
        };
    }

    govern.append($(`<div class="appoint header"><span class="has-text-caution">${loc(`governor_candidate`)}</span><span class="has-text-caution">${loc(`governor_background`)}</span><span></span><div>`));
    for (let i=0; i<global.race.governor.candidates.length; i++){
        let gov = global.race.governor.candidates[i];
        govern.append($(`<div class="appoint ${gov.bg}"><span class="has-text-warning">${gov.t} ${gov.n}</span><span class="bg">${gmen[gov.bg].name}</span><span><button class="button" v-on:click="appoint(${i})">${loc(`governor_appoint`)}</button></span><div>`));
    }

    vBind({
        el: '#candidates',
        data: global.race.governor,
        methods: {
            appoint(gi){
                if (global.genes['governor'] && global.tech['governor']){
                    let gov = global.race.governor.candidates[gi];
                    global.race.governor['g'] = gov;
                    delete global.race.governor.candidates;
                    defineGovernor();
                }
            }
        }
    });

    global.race.governor.candidates.forEach(function(gov){
        popover(`candidates-${gov.bg}`, function(){
            let desc = '';
            Object.keys(gmen[gov.bg].traits).forEach(function (t){
                desc += (gov_traits[t].hasOwnProperty('effect') ? gov_traits[t].effect() : '') + ' ';
            });
            return desc;
        },
        {
            elm: `#candidates .${gov.bg} .bg`,
        });
    });
}

export function govActive(trait,val){
    if (global.race.hasOwnProperty('governor') && global.race.governor.hasOwnProperty('g')){
        return gmen[global.race.governor.g.bg].traits[trait] ? gov_traits[trait].vars[val] : false;
    }
    return false;
}

const gov_tasks = {
    slave: { // Replace Slaves
        name: loc(`gov_task_slave`),
        req(){
            return checkCityRequirements('slave_market') && global.race['slaver'] && global.city['slave_pen'] ? true : false;
        },
        task(){
            if ( $(this)[0].req() && global.resource.Money.amount + 25000 + global.resource.Money.diff >= global.resource.Money.max ){
                let max = global.city.slave_pen.count * 4;
                if (max > global.city.slave_pen.slaves){
                    actions.city.slave_market.action();
                }
            }
        }
    },
    sacrifice: { // Sacrifice Population
        name: loc(`gov_task_slave`),
        req(){
            return checkCityRequirements('s_alter') && global.city.hasOwnProperty('s_alter') && global.city['s_alter'].count >= 1 ? true : false;
        },
        task(){
            if ( $(this)[0].req() && global.resource[global.race.species].amount === global.resource[global.race.species].max ){
                actions.city.s_alter.action();
            }
        }
    },
};