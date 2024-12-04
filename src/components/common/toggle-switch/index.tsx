import React from 'react';
import styles from './styles.module.scss';

type Props = {
  id: string;
  checked: boolean;
  onChange: (e: any) => void;
  name?: string;
  optionLabels?: string[];
  disabled?: boolean;
};

const ToggleSwitch: React.FC<Props> = ({
  id,
  name,
  checked,
  onChange,
  optionLabels = ['STATISTICAL', 'SINGLE'],
  disabled,
}: Props) => {
  function handleKeyPress(e: any) {
    if (e.keyCode !== 32) return;

    e.preventDefault();
    onChange(!checked);
  }

  return (
    <div className={styles.toggleSwitch}>
      <input
        type="checkbox"
        name={name}
        className={styles.toggleSwitchCheckbox}
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {id ? (
        <label
          className={styles.toggleSwitchLabel}
          tabIndex={disabled ? -1 : 1}
          onKeyDown={(e) => handleKeyPress(e)}
          htmlFor={id}
        >
          <span
            className={
              disabled
                ? styles['toggleSwitchInner toggleSwitchDisabled']
                : styles.toggleSwitchInner
            }
            data-yes={optionLabels[0]}
            data-no={optionLabels[1]}
            tabIndex={-1}
          />
          <span
            className={
              disabled
                ? styles['toggleSwitchSwitch toggleSwitchDisabled']
                : styles.toggleSwitchSwitch
            }
            tabIndex={-1}
          />
        </label>
      ) : null}
    </div>
  );
};

export default ToggleSwitch;
