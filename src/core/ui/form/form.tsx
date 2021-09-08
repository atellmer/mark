import React, { useEffect, useState, memo, useMemo, createContext, useContext } from 'react';

const FormContext = createContext<FormContextValue<{}>>(null);

type FormContextValue<S extends {}> = {
	value: S;
	setValue: (formValue: S) => void;
	brokenValidator: FormValidator<S>;
	addValidators: (formValue: Array<FormValidator<S>>) => () => void;
	removeValidators: (idx: number, count: number) => void;
};

function useForm<T>(source: T) {
	const [value, setValue] = useState(source);
	const connect = useMemo(
		() => ({
			value,
			formRef: connect?.formRef || null,
		}),
		[value],
	) as FormConnect<T>;

	useEffect(() => {
		if (!value && source) {
			setValue({ ...source });
		}
	}, [source]);

	const submit = () => connect?.formRef.submit();

	const validate = () => connect?.formRef.validate();

	return {
		connect,
		submit,
		validate,
	};
}

function useFormValue<T>() {
	const value = useContext(FormContext) as FormContextValue<T>;

	return value;
}

export type FormProps<S> = {
	connect: FormConnect<S>;
	component?: any;
	children: React.ReactNode;
	onSubmit: (options: OnSubmitOptions<S>) => void;
};

function Form<S>(props: FormProps<S>) {
	const { connect, component: Tag = 'div', children, onSubmit } = props;
	const [value, setValue] = useState<S>(connect.value);
	const [brokenValidator, setBrokenValidator] = useState<FormValidator<S>>(null);
	const scope = useMemo(() => ({ validators: [] }), []) as FormScope<S>;

	useEffect(() => {
		if (!value && connect.value) {
			setValue(connect.value);
		}
	}, [connect]);

	const submit = () => {
		return new Promise<boolean>(resolve => {
			validate().then(isValid => {
				if (isValid) {
					onSubmit({ value });
					resolve(true);
				}
				resolve(false);
			});
		});
	};

	const validate = () => {
		return new Promise<boolean>(resolve => {
			setBrokenValidator(null);

			if (scope.validators.length === 0) {
				resolve(true);
				return;
			}

			const syncValidators = scope.validators.filter(x => !x.isAsync).sort((a, b) => (a.order || 1) - (b.order || 1));

			if (syncValidators.length > 0) {
				const syncResults: Array<ValidationResult<S>> = syncValidators.map(x => ({
					isValid: x.fn(value) as boolean,
					validator: x,
				}));
				const syncBrokenResult = syncResults.find(x => x.isValid === false);
				const isSyncValid = !syncBrokenResult;

				if (!isSyncValid) {
					setBrokenValidator(syncBrokenResult.validator);
					resolve(false);
					return;
				}
			}

			const asyncValidators = scope.validators.filter(x => x.isAsync).sort((a, b) => (a.order || 1) - (b.order || 1));

			if (asyncValidators.length > 0) {
				Promise.all<ValidationResult<S>>(
					asyncValidators.map(x => {
						return new Promise(resolve => {
							(x.fn(value) as Promise<boolean>).then(result => {
								resolve({
									isValid: result,
									validator: x,
								});
							});
						});
					}),
				).then(results => {
					const asyncBrokenResult = results.find(x => x.isValid === false);
					const isAsyncValid = !asyncBrokenResult;

					if (!isAsyncValid) {
						setBrokenValidator(asyncBrokenResult.validator);
						resolve(false);
					} else {
						resolve(true);
					}
				});
			} else {
				resolve(true);
			}
		});
	};

	const addValidators = (validators: Array<FormValidator<S>>) => {
		const startIdx = scope.validators.length;

		scope.validators.push(...validators);

		return () => scope.validators.splice(startIdx, validators.length);
	};

	const removeValidators = (idx: number, count: number) => {
		scope.validators.splice(idx, count);
	};

	connect.formRef = {
		submit,
		validate,
	};

	const contextValue: FormContextValue<S> = {
		value,
		setValue,
		addValidators,
		removeValidators,
		brokenValidator,
	};

	return (
		<FormContext.Provider value={contextValue}>
			<Tag>{children}</Tag>
		</FormContext.Provider>
	);
}

const MemoForm = memo(Form);

export type FormControlProps<S, T> = {
	getValue: (formValue: S) => T;
	setValue: (formValue: S, value: T) => void;
	validators?: Array<FormValidator<S>>;
	required?: boolean;
	children: (options: FormControlChildrenOptions) => React.ReactNode;
};

function FormControl<S, T>(props: FormControlProps<S, T>) {
	const { getValue, setValue, validators = [], required, children } = props;
	const { value: formValue, brokenValidator, addValidators, setValue: setFormValue } = useFormValue<S>();
	const value = getValue(formValue);
	const scope = useMemo(() => ({ validators: [] }), []) as FormControlScope<S>;

	useEffect(() => {
		if (!required) {
			const idx = scope.validators.findIndex(x => x.code === REQUIRED_CODE);

			if (idx !== -1) {
				scope.validators.splice(idx, 1);
			}
		} else {
			const validator: FormValidator<S> = {
				fn: formValue => Boolean(getValue(formValue)),
				code: REQUIRED_CODE,
				error: REQUIRED_ERROR,
				key: getNextValidatorKey(),
			};

			scope.validators.push(validator);
		}
	}, [required]);

	useEffect(() => {
		scope.validators.push(...validators.map(x => ((x.key = getNextValidatorKey()), x)));

		const removeValidators = addValidators(scope.validators);

		return () => removeValidators();
	}, []);

	const onChange = (newValue: T) => {
		setValue(formValue, newValue);
		setFormValue({ ...formValue });
	};

	const ownBrokenValidator = useMemo(() => {
		return brokenValidator ? scope.validators.find(x => x.key === brokenValidator.key) : null;
	}, [brokenValidator]);

	return <>{children({ value, error: ownBrokenValidator ? ownBrokenValidator.error : '', onChange })}</>;
}

const MemoFormControl = memo(FormControl);

type FormRef = {
	submit: () => Promise<boolean>;
	validate: () => Promise<boolean>;
};

type FormConnect<T> = {
	value: T;
	formRef: FormRef;
};

type OnSubmitOptions<T> = {
	value: T;
};

type FormScope<S> = {
	validators: Array<FormValidator<S>>;
};

type FormValidator<S> = {
	fn: (formValue: S) => boolean | Promise<boolean>;
	error: string;
	isAsync?: boolean;
	order?: number;
	key?: string;
	code?: string;
};

type FormControlChildrenOptions = {
	value: any;
	error: string;
	onChange: (value: any) => void;
};

type ValidationResult<S> = {
	isValid: boolean;
	validator: FormValidator<S>;
};

type FormControlScope<S> = {
	validators: Array<FormValidator<S>>;
};

const REQUIRED_CODE = 'REQUIRED_CODE';
const REQUIRED_ERROR = 'Это обязательное поле';

let validatorID = 0;

const getNextValidatorKey = () => `FormControlKey:${++validatorID}`;

export { useForm, MemoForm as Form, MemoFormControl as FormControl };
