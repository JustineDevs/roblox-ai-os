# Roblox Creator Skills (RCS)

Αυτό το τοπικοποιημένο README είναι σκόπιμα σύντομο.
Χρησιμοποίησε τα κανονικά έγγραφα παρακάτω για την τρέχουσα επιφάνεια του προϊόντος.

- Πακέτο: `@jstn-sdk/rcs`
- Αποθετήριο: `https://github.com/JustineDevs/roblox-ai-os`
- Ξεκίνημα: [../getting-started.html](../getting-started.html)
- Αναφορά skills: [../skills.html](../skills.html)
- Ενσωματώσεις: [../integrations.html](../integrations.html)
- Κανονικό README: [../../README.md](../../README.md)

## Κανονική ροή creator

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Για εργασία υλοποίησης στο Roblox ισχύει το υποχρεωτικό pre-action gate πριν από οποιαδήποτε παραγωγή κώδικα:
- συγκέντρωσε αναφορές
- χτίσε κατανόηση
- τυποποίησε την ορολογία
- σχεδίασε αρθρωτή αρχιτεκτονική δέντρου αρχείων
- και μόνο μετά υλοποίησε

Δες:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## Ενεργοποίηση MCP

Μετά το `rcs setup`, η προεπιλεγμένη συμβατή με Codex ρύθμιση θα πρέπει να περιλαμβάνει δύο επίπεδα MCP:

1. **First-party RCS MCP servers** μέσω `rcs mcp-serve`
2. **Προεπιλεγμένους Roblox reference MCP servers** μέσω GitMCP remote transport

Προτεινόμενο μοντέλο:
- κράτησε το **`rcs mcp-serve`** ενεργό για τοπικό runtime/state/control-plane έργο
- κράτησε τους **GitMCP Roblox reference servers** ενεργούς από προεπιλογή για λιγότερες παραισθήσεις και καλύτερη πλατφορμική θεμελίωση
- ενεργοποίησε το **`robloxstudio-mcp`** χειροκίνητα μόνο όταν θέλεις ζωντανή σύνδεση Codex CLI <-> Roblox Studio

Σημαντική διευκρίνιση:
- το `rcs mcp-serve` εξυπηρετεί μόνο **τοπικούς MCP servers που ανήκουν στο RCS**
- **δεν** εξυπηρετεί το `robloxstudio-mcp`

## Ιδιοκτησία

Το RCS ανήκει και συντηρείται από τους [JustineDevs](https://github.com/JustineDevs) και [@JustineDevs](https://github.com/JustineDevs) για Roblox creator workflows.

## Ευχαριστίες

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Άδεια

[MIT](https://opensource.org/licenses/MIT)
