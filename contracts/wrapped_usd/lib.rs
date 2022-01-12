#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod wrapped_usd {
    use wrapper::impls::wrapped_usd::*;

    #[ink(storage)]
    #[derive(Default, PSP22Storage)]
    pub struct Contract {
        #[PSP22StorageField]
        psp22: PSP22Data,
        wrapped_psp22: WrappedPSP22Data,
    }

    // impl WrappedPSP22Storage for Contract {
    //     fn get(&self) -> &WrappedPSP22Data {
    //         &self.wrapped_psp22
    //     }
    //
    //     fn get_mut(&mut self) -> &mut WrappedPSP22Data {
    //         &mut self.wrapped_psp22
    //     }
    // }
    // The impl section above can be generated via `impl_storage_trait` macro
    brush::impl_storage_trait!(WrappedPSP22Storage, Contract, wrapped_psp22, WrappedPSP22Data);

    impl PSP22 for Contract {}

    impl WrappedPSP22 for Contract {}

    impl Contract {
        #[ink(constructor)]
        pub fn new(psp22_account: AccountId) -> Self {
            Self {
                wrapped_psp22: WrappedPSP22Data {
                    wrapped_account: psp22_account,
                },
                psp22: Default::default(),
            }
        }
    }
}
