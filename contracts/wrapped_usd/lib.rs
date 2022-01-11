#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod wrapped_usd {
    use brush::{
        contracts::psp22::*,
        traits::InkStorage,
    };
    use ink_prelude::vec::Vec;

    #[brush::trait_definition]
    pub trait WrappedPSP22: PSP22 {
        /// Allow a user to deposit `amount` of underlying tokens and mint `amount` of the wrapped tokens to `account`
        #[ink(message)]
        fn deposit_for(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error>;

        /// Allow a user to burn `amount` of wrapped tokens and withdraw the corresponding number of underlying tokens to `account`
        #[ink(message)]
        fn withdraw_to(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error>;
    }

    #[ink(storage)]
    #[derive(Default, PSP22Storage)]
    pub struct WrappedUsd {
        #[PSP22StorageField]
        psp22: PSP22Data,

        wrapped_psp22: AccountId,
    }

    impl PSP22 for WrappedUsd {}

    impl WrappedPSP22 for WrappedUsd {
        #[ink(message)]
        fn deposit_for(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            PSP22Ref::transfer_from(
                &self.wrapped_psp22,
                Self::env().caller(),
                Self::env().account_id(),
                amount,
                Vec::<u8>::new(),
            )?;
            self._mint(account, amount)
        }

        #[ink(message)]
        fn withdraw_to(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
            self._burn(Self::env().caller(), amount)?;
            PSP22Ref::transfer(&self.wrapped_psp22, account, amount, Vec::<u8>::new())
        }
    }

    impl WrappedUsd {
        #[ink(constructor)]
        pub fn new(psp22_account: AccountId) -> Self {
            Self {
                wrapped_psp22: psp22_account,
                psp22: Default::default(),
            }
        }
    }
}
