/**
 * Establish each MMRPG dice type here as extensions of DiceTerm.
 * @extends {foundry.dice.terms.Die}
 */
export class MarvelDie extends foundry.dice.terms.Die {
	static DENOMINATION = 'm';

	constructor(termData) {
		super({ ...termData, faces: 6 });
	}

	/**
	 * CSS classes to apply based on the result of the die.
	 * @param {DiceTermResult} result
	 */
	getResultCSS(result) {
		let resultStyles = ['marvel-roll', 'die', 'd6']

		if (result.result === 1) {
			resultStyles.push('fantastic');
		} else if (result.result === 6) {
			resultStyles.push('max');
		}

		if (result.discarded){
			resultStyles.push('discarded');
		}
		return resultStyles;
	}

	/**
	 * Returns an 'M' in place of a roll of 1.
	 *
	 * @param {DiceTermResult} result
	 * @returns {string}
	 */
	getResultLabel(result) {
		if (result.result === 1) {
			return 'm';
		}

		return result.result.toString();
	}

	/**
	 * Override default roll behavior for this die to make an 'm' result (1) count as a value of 6.
	 */
	roll({ minimize = false, maximize = false } = {}) {
		const roll = super.roll({ minimize, maximize });

		if (roll.result === 1) {
			this.results[this.results.length - 1].count = 6;
		}

		return roll;
	}

	get total () {
		const total = super.total
		return total === 1 ? 6 : total
	}
}
